#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Lambda Unifier Agent
 * Automatiza a refatoração de múltiplos Lambda handlers em um único handler com roteamento
 */

class LambdaUnifier {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = options;
    this.handlers = [];
    this.log = [];
    this.errors = [];
  }

  async run(command, resource) {
    try {
      switch (command) {
        case 'analyze':
          await this.analyze(resource);
          break;
        case 'validate':
          await this.validate(resource);
          break;
        case 'refactor':
          await this.refactor(resource);
          break;
        case 'create-router':
          await this.createRouter();
          break;
        default:
          console.error(`❌ Comando desconhecido: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
      if (this.options.verbose) console.error(error.stack);
    }
  }

  async analyze(resourceName) {
    console.log(`\n📊 Analisando ${resourceName || 'projeto'}...\n`);

    const apiDir = path.join(this.projectPath, 'backend/src/functions/api');
    
    if (!fs.existsSync(apiDir)) {
      return console.error(`❌ Diretório API não encontrado: ${apiDir}`);
    }

    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));
    let matchCount = 0;

    for (const file of files) {
      if (resourceName && !file.toLowerCase().includes(resourceName.toLowerCase())) continue;

      const filePath = path.join(apiDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const handlers = this.detectHandlers(content);

      if (handlers.length > 0) {
        matchCount++;
        console.log(`✅ ${file}`);
        handlers.forEach(h => console.log(`   - ${h}`));
      }
    }

    if (matchCount === 0) {
      console.log(`❌ Nenhum arquivo encontrado para: ${resourceName}`);
    } else {
      console.log(`\n📈 Total: ${matchCount} arquivo(s) com padrão detectado\n`);
    }
  }

  detectHandlers(content) {
    const handlers = [];
    const handlerNames = ['list', 'listById', 'create', 'update', 'delete', 'listAll', 'listByIdPublic', 'updatePublic'];

    handlerNames.forEach(name => {
      const regex = new RegExp(`module\\.exports\\.${name}\\s*=\\s*async`);
      if (regex.test(content)) {
        handlers.push(name);
      }
    });

    return handlers;
  }

  async validate(resourceName) {
    console.log(`\n✔️ Validando ${resourceName || 'projeto'}...\n`);

    const apiDir = path.join(this.projectPath, 'backend/src/functions/api');
    const serverlessDir = path.join(this.projectPath, 'backend/src/serverless/functions');

    if (!fs.existsSync(apiDir)) {
      return console.error(`❌ Diretório API não encontrado`);
    }

    const file = path.join(apiDir, `${this.capitalizeFirst(resourceName)}.js`);
    
    if (!fs.existsSync(file)) {
      return console.error(`❌ Arquivo não encontrado: ${file}`);
    }

    const content = fs.readFileSync(file, 'utf8');
    const handlers = this.detectHandlers(content);

    if (handlers.length === 0) {
      return console.error(`❌ Nenhum handler encontrado em ${path.basename(file)}`);
    }

    console.log(`✅ Arquivo: ${path.basename(file)}`);
    console.log(`✅ Handlers detectados: ${handlers.join(', ')}`);

    // Verifica YML
    const ymlFile = path.join(serverlessDir, `${this.capitalizeFirst(resourceName)}.yml`);
    if (fs.existsSync(ymlFile)) {
      const ymlContent = fs.readFileSync(ymlFile, 'utf8');
      const yamlHandlerCount = (ymlContent.match(/handler:/g) || []).length;
      console.log(`✅ Arquivo YML: ${path.basename(ymlFile)}`);
      console.log(`   - ${yamlHandlerCount} função(ões) Lambda definidas`);
    }

    console.log(`\n✅ Validação passou! Pode refatorar.\n`);
  }

  async refactor(resourceName) {
    if (!this.options.dryRun) {
      if (!this.options.quiet) {
        const confirmed = await this.prompt(
          `🔄 Refatorar ${resourceName}? (s/n): `
        );
        if (confirmed.toLowerCase() !== 's') {
          console.log('❌ Refatoração cancelada');
          return;
        }
      }
    }

    console.log(`\n🔧 Refatorando ${resourceName}...\n`);

    const apiFile = path.join(
      this.projectPath,
      `backend/src/functions/api/${this.capitalizeFileName(resourceName)}.js`
    );

    const ymlFile = path.join(
      this.projectPath,
      `backend/src/serverless/functions/${this.capitalizeFirst(resourceName)}.yml`
    );

    if (!fs.existsSync(apiFile)) {
      return console.error(`❌ Arquivo não encontrado: ${apiFile}`);
    }

    // Step 1: Refatorar arquivo JS
    console.log(`📝 Refatorando ${path.basename(apiFile)}...`);
    let jsContent = fs.readFileSync(apiFile, 'utf8');

    // Adiciona import se não existir
    if (!jsContent.includes('createRouter')) {
      jsContent = jsContent.replace(
        'const imageService = require("../../services/ImageService");',
        'const imageService = require("../../services/ImageService");\nconst { createRouter } = require("../../utils/requestRouter");'
      );
      jsContent = jsContent.replace(
        'const imageService = require("../../services/ImageService");',
        'const imageService = require("../../services/ImageService");\nconst imageService = require("../../services/ImageService");\nconst { createRouter } = require("../../utils/requestRouter");'
      );
    }

    // Converte module.exports para const
    jsContent = jsContent.replace(/module\.exports\.(\w+)\s*=\s*async/g, 'const $1 = async');

    // Adiciona handler export no final
    const handlers = this.detectHandlers(jsContent);
    if (handlers.length > 0 && !jsContent.includes('module.exports.handler')) {
      const handlerExport = `\nmodule.exports.handler = createRouter({\n${handlers.map(h => `    ${h},`).join('\n')}\n    delete: deleteFn\n});`;
      jsContent = jsContent.replace(/const deleteFn.*?\n}\n*$/, match => match + handlerExport);
    }

    if (!this.options.dryRun) {
      fs.writeFileSync(apiFile, jsContent);
      console.log(`   ✅ Arquivo JS refatorado`);
    } else {
      console.log(`   ℹ️  [DRY RUN] Arquivo JS seria modificado`);
    }

    // Step 2: Atualizar YML
    if (fs.existsSync(ymlFile)) {
      console.log(`📝 Consolidando ${path.basename(ymlFile)}...`);
      let ymlContent = fs.readFileSync(ymlFile, 'utf8');

      // Substitui handlers múltiplos por um único
      const resourceNameLower = this.getResourceName(resourceName);
      ymlContent = ymlContent.replace(
        /(\w+):\n\s+handler: src\/functions\/api\/\w+\.\w+/g,
        `${resourceNameLower}:\n  handler: src/functions/api/${this.capitalizeFileName(resourceName)}.handler`
      );

      if (!this.options.dryRun) {
        fs.writeFileSync(ymlFile, ymlContent);
        console.log(`   ✅ Arquivo YML consolidado`);
      } else {
        console.log(`   ℹ️  [DRY RUN] Arquivo YML seria modificado`);
      }
    }

    console.log(`\n✅ Refatoração concluída!\n`);
    console.log('📋 Próximos passos:');
    console.log('   1. Teste localmente: serverless offline');
    console.log('   2. Valide as rotas: GET, POST, PUT, DELETE');
    console.log('   3. Execute testes unitários');
    console.log('   4. Faça deploy: serverless deploy\n');
  }

  async createRouter() {
    const routerPath = path.join(this.projectPath, 'backend/src/utils/requestRouter.js');

    if (fs.existsSync(routerPath)) {
      console.log('✅ requestRouter.js já existe');
      return;
    }

    const routerCode = `"use strict";

const createRouter = (handlers) => {
  return async (event, context) => {
    event.queryStringParameters = event.queryStringParameters || {};
    event.multiValueQueryStringParameters = event.multiValueQueryStringParameters || {};
    event.pathParameters = event.pathParameters || {};

    const { httpMethod, pathParameters, path } = event;
    const pathSuffix = path?.split('/').filter(Boolean).pop();

    try {
      if (httpMethod === 'GET') {
        if ((pathParameters?.proxy === 'all' || pathSuffix === 'all') && handlers.listAll) {
          return await handlers.listAll(event, context);
        } else if (pathParameters?.id && handlers.listById) {
          return await handlers.listById(event, context);
        } else if (handlers.list) {
          return await handlers.list(event, context);
        }
      }

      if (httpMethod === 'POST') {
        if ((pathParameters?.proxy === 'delete' || pathSuffix === 'delete') && handlers.delete) {
          return await handlers.delete(event, context);
        } else if (handlers.create) {
          return await handlers.create(event, context);
        }
      }

      if (httpMethod === 'PUT') {
        if (handlers.update) {
          return await handlers.update(event, context);
        }
      }

      if (httpMethod === 'DELETE' && pathParameters?.id && handlers.delete) {
        return await handlers.delete(event, context);
      }

      return {
        statusCode: 405,
        body: JSON.stringify({ statusCode: 405, data: {}, message: 'Método não permitido' })
      };
    } catch (err) {
      const { handlerErrResponse } = require('./handleResponse');
      return await handlerErrResponse(err);
    }
  };
};

module.exports = { createRouter };
`;

    if (!this.options.dryRun) {
      fs.writeFileSync(routerPath, routerCode);
      console.log(`✅ requestRouter.js criado em ${routerPath}`);
    } else {
      console.log(`ℹ️  [DRY RUN] requestRouter.js seria criado`);
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  capitalizeFileName(str) {
    return str.split(/[\s\-_]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
  }

  getResourceName(str) {
    return str.toLowerCase();
  }

  prompt(question) {
    return new Promise(resolve => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  showHelp() {
    console.log(`
Lambda Unifier - Refatore múltiplos Lambda handlers em um

Uso:
  node lambda-unifier.js <command> [resource] [options]

Comandos:
  analyze <resource>    Analisa um arquivo e detecta handlers
  validate <resource>   Valida se pode refatorar
  refactor <resource>   Refatora o arquivo e YML
  create-router         Cria o arquivoRequestRouter

Opções:
  --dry-run            Simula sem modificar arquivos
  --quiet              Sem confirmação interativa
  --verbose            Modo verbose

Exemplos:
  node lambda-unifier.js analyze Users
  node lambda-unifier.js validate Companies
  node lambda-unifier.js refactor Sales --dry-run
  node lambda-unifier.js create-router
    `);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    new LambdaUnifier('.').showHelp();
    return;
  }

  const command = args[0];
  const resource = args[1];
  const options = {
    dryRun: args.includes('--dry-run'),
    quiet: args.includes('--quiet'),
    verbose: args.includes('--verbose'),
    keepPublic: args.includes('--keep-public-endpoints')
  };

  const unifier = new LambdaUnifier('.', options);
  await unifier.run(command, resource);
}

main().catch(console.error);
