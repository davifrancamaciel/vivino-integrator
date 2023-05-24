"use strict";

const db = require('../database');
const Sale = require('../models/Sale')(db.sequelize, db.Sequelize);
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const SaleProduct = require('../models/SaleProduct')(db.sequelize, db.Sequelize);

// const resp = await listProducts()
// return handlerResponse(200, resp)

const listProducts = async () => {
    const result = await Sale.findAll({
        attibutes: ['productsFormatted', 'id']
    })
    let list = []
    result.map(s => s.productsFormatted.map(p => list.push({
        saleId: s.id,
        createdAt: s.createdAt, updatedAt: s.updatedAt, ...formatProduct(p)
    })))

    const listNomalizedNames = list.map(x => ({ ...x, newName: formatName(x) }))
    list = listNomalizedNames

    var distinctProductsArray = []
    list.forEach(element => {
        const { newName, name, id, value, qtd, saleId, createdAt, updatedAt } = element
        var isEsxit = distinctProductsArray.find(x => x.newName === newName)
        if (isEsxit) {
            distinctProductsArray = distinctProductsArray.filter(x => x.newName !== newName)
            var ids = isEsxit.ids
            ids.push({ name, id, value, qtd, saleId, createdAt, updatedAt })
            distinctProductsArray.push({ ...isEsxit, ids })
        } else {
            distinctProductsArray.push({ ...element, ids: [{ name, id, value, qtd, saleId, createdAt, updatedAt }] })
        }
    });
    let productsOrder = order(distinctProductsArray, 'newName')
    productsOrder = productsOrder.map((x, i) => ({ ...x, id: i + 1 }))

    var productSaleList = []
    for (let i = 0; i < productsOrder.length; i++) {
        const product = productsOrder[i];
        for (let j = 0; j < product.ids.length; j++) {
            const sale = product.ids[j];
            productSaleList.push({
                companyId: '7e39bb26-a932-412a-995d-ca7edd356d9d',
                saleId: sale.saleId,
                productId: product.id,
                value: sale.value / sale.qtd,
                valueAmount: sale.value,
                amount: sale.qtd,
                createdAt: sale.createdAt,
                updatedAt: sale.updatedAt
            })

        }
    }

    const products = productsOrder.map(x => {
        const { newName, newValue, createdAt, updatedAt } = x
        return {
            companyId: '7e39bb26-a932-412a-995d-ca7edd356d9d',
            name: newName,
            price: newValue,
            createdAt,
            updatedAt
        }
    })

    // return productsOrder.map(x => (x.newName))
    if (true) {
        await Product.bulkCreate(products);
        return await SaleProduct.bulkCreate(productSaleList);
    }
    return productsOrder
    // return productSaleList.filter(x => x.amount > 1)    
}

const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

const formatName = (p) => {
    let name = p.newName;

    //#region A
    if (name === 'Almas super' || name === 'Almasuoer' || name === 'Alma super')
        return 'Almasuper'
    if (name === 'Agulas' || name === 'Agulhas' || name === 'Agulha de mao' || name === 'Agulha' || name === 'Agulhas de mao')
        return 'Agulha de mão'
    if (name === 'Agulhas de fogão' || name === 'Agulha fogão')
        return 'Agulha de fogão'
    if (name === 'Agualhas de máquina' || name === 'Agulha  máquina' || name === 'Agulhas de máquina' || name === 'Agulhas de máquinas' || name === 'Agulhas de máquinha')
        return 'Agulha de máquina'
    if (name === 'Alfinetes')
        return 'Alfinete'
    if (name === 'Amassador')
        return 'Amassador de batata'
    if (name === 'Arvore')
        return 'Arvore de natal'
    if (name === 'Alianca' || name === 'Alianças')
        return 'Aliança'
    if (name === 'Aneis' || name === 'Anéis' || name === 'Anél')
        return 'Anel'
    if (name === 'Apantador' || name === 'Apontadores')
        return 'Apontador'
    if (name === 'Acquaplay' || name === 'Aqua play' || name === 'Aqua pley')
        return 'Acqua play'
    if (name === 'Arco cabelo')
        return 'Arco de cabelo'
    if (name === 'Arco copa' || name === 'Arco de copa' || name === 'Arco do brasil' || name === 'Arcos do brasil')
        return 'Arco de cabelo da copa'
    if (name === 'Argila espandida' || name === 'Argilas expandida' || name === 'Argilas')
        return 'Argila expandida'
    if (name === 'Aruda' || name === 'Arrudas')
        return 'Arruda'
    if (name === 'Arvore natal' || name === 'Arvores de natal caixa')
        return 'Arvore de natal'
    if (name === 'Autentica')
        return 'Autentica'
    if (name === 'Azaleia')
        return 'Azaléia'
    if (name === 'Abelha')
        return 'Abelinha brinquedo'
    if (name === 'Adaptadores' || name === 'Adaptador tomada' || name === 'Adaptador' || name === 'Adptador')
        return 'Adaptador de tomada'
    if (name === 'Anturios')
        return 'Anturio'
    if (name === 'Arranjos flor artificial' || name === 'Arranjo flor artificial')
        return 'Arranjo de flor artificial'
    name = replaceS(name, 'Agulha')
    name = replaceS(name, 'Arco')
    name = replaceS(name, 'Acetona')
    name = replaceS(name, 'Arco')

    //#endregion

    //#region B
    name = replaceS(name, 'Bacia')
    name = replaceS(name, 'Bloco')
    name = replaceS(name, 'Bolsa')

    if (name === 'Balde praia' || name === 'Baldinho de praia' || name === 'Baldes de praia')
        return 'Balde de praia'
    if (name === 'Balybled' || name === 'Blay bayd' || name === 'Blay bled' || name === 'Blaybled' || name === 'Blaybleis')
        return 'Blay blayd'
    if (name === 'Banddeija' || name === 'Bandeija')
        return 'Bandeja'
    if (name === 'Banjamin' || name === 'Beijamim' || name === 'Benjamin' || name === 'Bejamim' || name === 'Benjamim')
        return 'Bejamin'
    if (name === 'Batons')
        return 'Batom'
    if (name === 'Bau')
        return 'Baú'
    if (name === 'Begonea' || name === 'Begonha')
        return 'Begonia'
    if (name === 'Bichos de pelúcia' || name === 'Bicho de pelucia')
        return 'Bicho de pelúcia'
    if (name === 'Blocos inss')
        return 'Bloco inss'
    if (name === 'Boddy slpresh' || name === 'Boddy slpassh' || name === 'Boddy slash' || name === 'Boddysplash' || name === 'Body slpesh' || name === 'Bodd slossh')
        return 'Boddy splash'
    if (name === 'Bola da lol' || name === 'Bolas da lol')
        return 'Bola lol'
    if (name === 'Bateria 9 v')
        return 'Bateria 9v'
    if (name === 'Baterias')
        return 'Bateria'
    if (name === 'Bisnaga maiones')
        return 'Bisnaga maionese'
    if (name === 'Blocos' || name === 'Bloquinhos' || name === 'Blocos de anotar' || name === 'Blocos de anotação')
        return 'Bloco'
    if (name === 'Bola 6,5' || name === 'Bolas n°6,5' || name === 'Bola n° 6,5' || name === 'Bola n°6,5' || name === 'Bola de aniversário 6,5')
        return 'Bola de aniversário n° 6,5'
    if (name === 'Bola couro')
        return 'Bola de couro'
    if (name === 'Bola sonic' || name === 'Bolas sonic')
        return 'Bola do sonic'
    if (name === 'Bolha de sabao' || name === 'Bolhas de sabao' || name === 'Bolinha sabão' || name === 'Bola sabão' || name === 'Bola de sabão' || name === 'Bol de sabão' || name === 'Bolinha de sabão')
        return 'Bolha de sabão'
    if (name === 'Bolsas')
        return 'Bolsa'
    if (name === 'Bonecas')
        return 'Boneca'
    if (name === 'Bonés' || name === 'Bone')
        return 'Boné'
    if (name === 'Bolsas presente' || name === 'Bolsas d presente' || name === 'Bolsas d presente' || name === 'olsa presente')
        return 'Bolsa de presente'
    if (name === 'Bomboniere')
        return 'Bombonier'
    if (name === 'Borracha panela' || name === 'Borracha de panela' || name === 'Borracha panela pressao' || name === 'Borracha de panela pressão')
        return 'Borracha de panela de  pressão'
    if (name === 'Borriifador')
        return 'Borrifador'
    if (name === 'Bromelia')
        return 'Bromélia'
    if (name === 'Baldes')
        return 'Balde'
    if (name === 'Bola n8')
        return 'Bola número 8'
    if (name === 'Bolas')
        return 'Bola'
    if (name === 'Borrachas')
        return 'Borracha'
    if (name === 'Brincos')
        return 'Brinco'
    if (name === 'Brinquedos')
        return 'Brinquedo'
    if (name === 'Buque' || name === 'Buquês')
        return 'Buquê'
    if (name.includes('Baterias'))
        name = name.replace('Baterias', 'Bateria')
    if (name === 'Baterias lr 44' || name === 'Bateria lr 44')
        return 'Bateria lr44'
    if (name === 'Borracha panela 7l')
        return 'Borracha panela 7l'
    //#endregion

    //#region C
    if (name === 'C9rda de varal')
        return 'Corda de varal'
    if (name === 'Cofre botijao')
        return 'Cofre de botijao'
    if (name === '5l de cloro' || name === 'Cloro' || name === 'Cloror' || name === 'Cloros')
        return 'Cloro 5 litros'
    name = replaceS(name, 'plastico')
    if (name.includes(`plastico`))
        name = name.replace(`plastico`, 'plástico')
    if (name.includes(`Colonia`))
        name = name.replace(`Colonia`, 'Colônia')
    if (name.includes(`W `))
        name = capitalize(name.replace(`W `, ''))
    name = replaceS(name, 'Cortina')
    name = replaceS(name, 'Cinto')
    name = replaceS(name, 'Chaveiro')
    name = replaceS(name, 'Cabide')
    name = replaceS(name, 'Confete')
    name = replaceS(name, 'Creme')
    name = replaceS(name, 'Cumbuca')
    name = replaceS(name, 'Cesta')
    name = replaceS(name, 'Calculadora')
    name = replaceS(name, 'Calcinha')
    name = replaceS(name, 'Cadeado')
    name = replaceS(name, 'Corda')
    name = replaceS(name, 'Caderneta')
    name = replaceS(name, 'Cofre')
    name = replaceS(name, 'Colônia')
    name = replaceS(name, 'Caneca')
    name = replaceS(name, 'Cabo')
    name = replaceS(name, 'Caneta')
    name = replaceS(name, 'Caderno')
    name = replaceS(name, 'Caixa')
    name = replaceS(name, 'Chinelo')
    name = replaceS(name, 'Cola')
    name = replaceS(name, 'Copo')
    name = replaceS(name, 'Corda')
    name = replaceS(name, 'Cola')
    if (name.includes('Colheres'))
        name = name.replace('Colheres', 'Colher')
    if (name.includes('Conj '))
        name = name.replace('Conj ', 'Conjunto ')
    if (name.includes('sofé'))
        name = name.replace('sofé', 'sofá')
    if (name.includes('sofé'))
        name = name.replace('sofé', 'sofá')
    if (name === 'Cabo celular' || name === 'Cabo p celular' || name === 'Cabo carregador')
        return 'Cabo de celular'
    if (name === 'Cabo tv')
        return 'Cabo de tv'
    if (name === 'Cachepo')
        return 'Cachepô'
    if (name === 'Cadarco' || name === 'Cadarcos' || name === 'Cadarços')
        return 'Cadarço'
    if (name === 'Carne de inss' || name === 'Carne inss')
        return 'Carnê inss'
    if (name === 'Caixa sabonete')
        return 'Caixa de sabonete'
    if (name === 'Caneca aluminio' || name === 'Canecas de aluminio')
        return 'Caneca alumínio'
    if (name === 'Caminhões' || name === 'Caminhao')
        return 'Caminhão'
    if (name === 'Orquidea' || name === 'Orquideas' || name === 'Orquídeas')
        return 'Orquídeas'
    //#endregion


    name = replaceS(name, 'Fita')
    name = replaceS(name, 'Dinossauro')
    name = replaceS(name, 'Desodorante')
    name = replaceS(name, 'Estilete')
    name = replaceS(name, 'Enfeite')
    name = replaceS(name, 'Escova')
    name = replaceS(name, 'Estojo')
    name = replaceS(name, 'Faca')
    name = replaceS(name, 'Feixo')
    name = replaceS(name, 'Fertilizante')
    name = replaceS(name, 'Fitilho')
    name = replaceS(name, 'Forminha')
    name = replaceS(name, 'Garrafinha')
    name = replaceS(name, 'Gorro')
    name = replaceS(name, 'Guache')
    name = replaceS(name, 'Folha')
    name = replaceS(name, 'Forma')
    name = replaceS(name, 'Garfo')
    name = replaceS(name, 'Garrafa')
    name = replaceS(name, 'Jarra')
    name = replaceS(name, 'Laço')
    name = replaceS(name, 'Liga')
    name = replaceS(name, 'Lousa')
    name = replaceS(name, 'Linha')
    name = replaceS(name, 'Lâmpada')
    name = replaceS(name, 'Marmita')
    name = replaceS(name, 'Mascara')
    name = replaceS(name, 'Máscara')
    name = replaceS(name, 'Massinha')
    name = replaceS(name, 'Metro')
    name = replaceS(name, 'Mola')
    name = replaceS(name, 'Mt')
    name = replaceS(name, 'Muda')
    name = replaceS(name, 'Pacote')
    name = replaceS(name, 'Pano')
    name = replaceS(name, 'Palito')
    name = replaceS(name, 'Pilha')
    name = replaceS(name, 'Placa')
    name = replaceS(name, 'Ponteira')
    name = replaceS(name, 'Pote')
    name = replaceS(name, 'Prato')
    name = replaceS(name, 'Pente')
    name = replaceS(name, 'Planta')
    name = replaceS(name, 'Ponta')
    name = replaceS(name, 'Porco')
    name = replaceS(name, 'Quentinha')
    name = replaceS(name, 'Relógio')
    name = replaceS(name, 'Rolo')
    name = replaceS(name, 'Saco')
    name = replaceS(name, 'Sabonete')
    name = replaceS(name, 'Semente')
    name = replaceS(name, 'Tinta')
    name = replaceS(name, 'Taça')
    name = replaceS(name, 'Toalhinha                                                                                           ')
    name = replaceS(name, 'Tira')
    name = replaceS(name, 'Touca')
    name = replaceS(name, 'Vaso')
    name = replaceS(name, 'Vela')
    name = replaceS(name, 'Válvula')
    name = replaceS(name, 'Sereia')
    name = replaceS(name, 'Slime')
    name = replaceS(name, 'Sombrinha')
    name = replaceS(name, 'Suporte')
    name = replaceS(name, 'Travessa')
    name = replaceS(name, 'Tubo')
    name = replaceS(name, 'Tulipa')
    name = replaceS(name, 'Unha')
    name = replaceS(name, 'Vassoura')
    name = replaceS(name, 'Violeta')
    name = replaceS(name, 'Vuvuzela')
    name = replaceS(name, 'Corneta')
    name = replaceS(name, 'Envelope')
    name = replaceS(name, 'quente')
    name = replaceS(name, 'Galho')
    name = replaceS(name, 'Gancho')
    name = replaceS(name, 'Isqueiro')
    name = replaceS(name, 'Jardineira')
    name = replaceS(name, 'Lanterna')
    name = replaceS(name, 'Lixa')
    name = replaceS(name, 'Brinco')
    name = replaceS(name, 'Espelho')
    name = replaceS(name, 'Esmalte')
    name = replaceS(name, 'Esponja')
    name = replaceS(name, 'Espuma')
    name = replaceS(name, 'Lapiseira')
    name = replaceS(name, 'Meia')
    name = replaceS(name, 'Rimel')
    name = replaceS(name, 'Xuxinha')

    name = name.replace(`ônibus`, 'Ônibus')
    name = name.replace(`Sutian`, 'Sutiã')
    name = name.replace(`Sutien`, 'Sutiã')
    name = name.replace(`Rimil`, 'Rimel')
    name = name.replace(`Mudas`, 'Muda')
    name = name.replace(`Pares`, 'Par')
    name = name.replace(`Festao`, 'Festão')
    name = name.replace(`Festões`, 'Festão')
    name = name.replace(`Faça`, 'Faca')
    name = name.replace(`M7das`, 'Mudas')
    name = name.replace(`Ipanemas`, 'Ipanema')
    name = name.replace(`barralho`, 'baralho')
    name = name.replace(`Barralho`, 'Baralho')
    name = name.replace(`Kennedy`, 'Kenner')
    name = name.replace(`presentes`, 'presente')
    name = name.replace(`mágicos`, 'mágico')
    name = name.replace(`cabeo`, 'cabelo')
    name = name.replace(`silicine`, 'silicone')
    name = name.replace(`Liga silicone`, 'Liga de silicone')
    name = name.replace(`pompom`, 'pom pom')
    name = name.replace(`laço cabelo`, 'laços de cabelo')
    name = name.replace(`laço de cabelo`, 'laços de cabelo')
    name = name.replace(`Laço p/ cabelo`, 'Laço de cabelo')
    name = name.replace(`Laço para cabelo`, 'Laço de cabelo')

    name = name.replace(`Isquiro`, 'Isqueiro')
    name = name.replace(`Isqueiro big`, 'Isqueiro bic')
    name = name.replace(`papeis`, 'Papel')
    name = name.replace(`Cartões`, 'Cartão')
    name = name.replace(`Carrinhos`, 'Carrinho')
    name = name.replace(`Meio m`, 'M')
    name = name.replace(`Mochilas`, 'Mochila')
    name = name.replace(`Mt`, 'Metro')
    name = name.replace(`MT`, 'Metro')
    name = name.replace(`M `, 'Metro ')
    name = name.replace(`Metro d `, 'Metro de ')
    name = name.replace(`Dz `, 'Dúzia ')
    name = name.replace(`Jg `, 'Jogo ')
    name = name.replace(`Varões`, 'Varão')
    name = name.replace(`Refis`, 'Refil')
    name = name.replace(`Pinos`, 'Pino')
    name = name.replace(`Pct`, 'Pacote')
    name = name.replace(`Cx`, 'Caixa')
    name = name.replace(`Coadores`, 'Coador')
    name = name.replace(`Borrifadores`, 'Borrifador')
    name = name.replace(`Autentica`, 'Autêntica')
    name = name.replace(`toyota`, 'toy')
    name = name.replace(`de  pressão`, 'de pressão')
    name = name.replace(`Borracha panela 7l`, 'Borracha de panela 7l')
    name = name.replace(`Bola número 8`, 'Bola de aniversário n°8')
    name = name.replace(`c/ 12`, 'c/12')
    name = name.replace(`Borrachas`, 'Borracha')
    name = name.replace(`musck`, 'musk')
    name = name.replace(`descartacel`, 'descartável')
    name = name.replace(`descartavel`, 'descartável')
    name = name.replace(`Cordoa de celular`, 'Cordão de celular')
    name = name.replace(`Cordão p/ celular`, 'Cordão de celular')
    name = name.replace(`Cordões de celular`, 'Cordão de celular')
    name = name.replace(`Correntes`, 'Corrente')
    name = name.replace(`depilatorio`, 'depilatório')
    name = name.replace(`Cuecas`, 'Cueca')
    name = name.replace(`Cuador`, 'Coador')
    name = name.replace(`Crtão`, 'Cartão')
    name = name.replace(`Cuiaa`, 'Cuia')
    name = name.replace(`Cuias`, 'Cuia')
    name = name.replace(`Delicia`, 'Delícia')
    name = name.replace(`Cuia de caldo`, 'Cuia para caldo')
    name = name.replace(`Capaz p fogão`, 'Capa de fogão')
    name = name.replace(`Cartão p/ natal`, 'Cartão de natal')
    name = name.replace(`Cartão natal`, 'Cartão de natal')
    name = name.replace(`Descasador`, 'Descascador')
    name = name.replace(`Descascadores`, 'Descascador')
    name = name.replace(`Desintupidor`, 'Desentupidor')
    name = name.replace(`Desuntupidor`, 'Desentupidor')
    name = name.replace(`Desodorante`, 'Desodorante')
    name = name.replace(`Desorante`, 'Desodorante')
    name = name.replace(`Desodorantes`, 'Desodorante')
    name = name.replace(`Dipladenia`, 'Dipladênia')
    name = name.replace(`Embalagens`, 'Embalagem')
    name = name.replace(`Enfeite natal c/12. unidades`, 'Enfeite de natal c/12')
    name = name.replace(`Extensão 3m`, 'Extensão de 3m')
    name = name.replace(`Extenção 3m`, 'Extensão de 3m')
    name = name.replace(`Fetilho`, 'Fitilho')
    name = name.replace(`Fittilho`, 'Fitilho')
    name = name.replace(`Fl9r`, 'Flor')
    name = name.replace(`Forcinha`, 'Forma')
    name = name.replace(`Form7nha`, 'Forma')
    name = name.replace(`Forminha`, 'Forma')
    name = name.replace(`Fominha`, 'Forma')

    name = name.replace(`Mochila lol`, 'Mochila da lol')
    name = name.replace(`arrudas`, 'arruda')
    name = name.replace(`rosas`, 'rosa')
    name = name.replace(`Musck`, 'Musk')
    name = name.replace(`descartavel`, 'descartável')

    name = name.replace(`eceser`, 'ecessaire')
    name = name.replace(`ecessarie`, 'ecessaire')
    name = name.replace(`ecesser`, 'ecessaire')
    name = name.replace(`ecesserie`, 'ecessaire')
    name = name.replace(`ecssarie`, 'ecessaire')
    name = name.replace(`Arvore`, 'Árvore')
    name = name.replace(`Corente`, 'Corrente')
    name = name.replace(`Durem`, 'Durex')
    name = name.replace(`Enfeite natal`, 'Enfeite de natal')
    name = name.replace(`Dupla faces`, 'Dupla-face')
    name = name.replace(`Corrent `, 'Corrente ')
    name = name.replace(`Escorado`, 'Escoredor de')
    name = name.replace(`Escoredor`, 'Escoredor de')
    name = name.replace(`Durem`, 'Durex')
    name = name.replace(`Havaianas`, 'Chinelo havaianas')
    name = name.replace(`Havanas`, 'Chinelo havaianas')
    name = name.replace(`Havianas`, 'Chinelo havaianas')
    name = name.replace(`Havainas`, 'Chinelo havaianas')
    name = name.replace(`Havana`, 'Chinelo havaianas')
    name = name.replace(`havanas`, 'havaianas')
    name = name.replace(`havianas`, 'havaianas')
    name = name.replace(`Chinelo havaiana`, 'Chinelo havaianas')
    name = name.replace(`Ipanema`, 'Chinelo ipanema')
    name = name.replace(`ipanemas`, 'ipanema')
    name = name.replace(`panelinhas`, 'panelinha')
    name = name.replace(`cuador`, 'coador')
    name = name.replace(`metrica`, 'métrica')
    name = name.replace(`cafe`, 'café')
    name = name.replace(`docinha`, 'de docinho')
    name = name.replace(`Forma doce`, 'Forma de doce')
    name = name.replace(`Forma n `, 'Forma de doce número ')
    name = name.replace(`Forma n° `, 'Forma de doce número ')
    name = name.replace(`Forma n°`, 'Forma de doce número ')
    name = name.replace(`Forma número`, 'Forma de doce número ')
    name = name.replace(`cafe`, 'café')
    name = name.replace(`c glitter`, 'com gliter')
    name = name.replace(`c9m glitter`, 'com gliter')
    name = name.replace(`Cola isopor`, 'Cola de isopor')
    name = name.replace(`Desosdorante`, 'Desodorante')
    name = name.replace(`Desosdorantes`, 'Desodorante')
    name = name.replace(`Desodoante`, 'Desodorante')
    name = name.replace(`Durex`, 'Fita durex')
    name = name.replace(`durem`, 'durex')
    name = name.replace(`Unos`, 'Uno')
    name = name.replace(`Forrminha`, 'Forma de doce')
    name = name.replace(`Fita durex largo`, 'Fita durex larga')
    name = name.replace(`Forma de docinho`, 'Forma de doce')
    name = name.replace(`n°`, 'número ')
    name = name.replace(`Forma p `, 'Forma de ')
    name = name.replace(`Forma para `, 'Forma de ')
    name = capitalize(name.replace(`Unid de `, ''))
    name = capitalize(name.replace(`Unid `, ''))
    name = capitalize(name.replace(`Und `, ''))
    name = name.replace(`latas`, 'lata')
    name = capitalize(name.replace(` liga`, 'liga'))
    name = capitalize(name.replace(`1carrinho`, 'carrinho'))
    name = capitalize(name.replace(`1kit`, 'kit'))
    name = capitalize(name.replace(`1. kit`, 'kit'))
    name = capitalize(name.replace(`1toalha`, 'toalha'))
    name = capitalize(name.replace(`1o metro`, 'metro de '))
    name = capitalize(name.replace(`3scova`, 'escova'))
    name = name.replace(`Kit de`, 'Kit')
    name = name.replace(`Kit`, 'Kit de')
    name = name.replace(`Killer`, 'Kit de')
    name = name.replace(`Ki lol`, 'Kit de lol')
    name = name.replace(`Kentinha`, 'Quentinha')
    name = name.replace(`L de cloro`, 'Cloro 5 litros')
    name = name.replace(`Kolanchoe`, 'Kalanchoe')
    name = name.replace(`Kalinchoe`, 'Kalanchoe')
    name = name.replace(`Kalanchoe q"`, 'Kalanchoe')
    name = name.replace(`Mansinho`, 'Massinha')
    name = name.replace(`Mansinho`, 'Massinha')
    name = name.replace(`havaianass`, 'havaianas')
    name = name.replace(`L8ga`, 'Liga')
    name = name.replace(`Pacotea`, 'Pacote')
    name = name.replace(`Pacotec`, 'Pacote')
    name = name.replace(`Pacotes`, 'Pacote')
    name = name.replace(`Pacotet`, 'Pacote')
    name = name.replace(`Pacoteliga`, 'Pacote de liga')
    name = name.replace(`T8ra`, 'Tira')
    name = name.replace(`Tirra`, 'Tira')
    name = name.replace(`Terrra`, 'Terra')
    name = name.replace(`Terrras`, 'Terra')
    name = name.replace(`Thread bond`, 'Threebond')
    name = name.replace(`Three bond`, 'Threebond')
    name = name.replace(`Trebond`, 'Threebond')
    name = name.replace(`Aranjos`, 'Arranjos')
    name = name.replace(`Autentica`, 'Autêntica')
    name = name.replace(`Batons`, 'Batom')
    name = name.replace(`Buque`, 'Buquê')
    name = name.replace(`gilete`, 'gillette')
    name = name.replace(`Caixas`, 'Caixa')
    name = name.replace(`Carto`, 'Cartão')
    name = name.replace(`Cartlagem`, 'Cartilagem')
    name = name.replace(`Cartolinas`, 'Cartolina')
    name = name.replace(`Chinelis`, 'Chinelo')
    name = name.replace(`kener`, 'kenner')
    name = name.replace(`c9m`, 'com')
    name = name.replace(`Escorred9r`, 'Escorredor')
    name = name.replace(`Escoredor`, 'Escorredor')
    name = name.replace(`Flores`, 'Flor')
    name = name.replace(`Gliter`, 'Glitter')
    name = name.replace(`Gilette`, 'Gillette')
    name = name.replace(`Caixa d `, 'Caixa de ')
    name = name.replace(`Lacinho cabelo`, 'Lacinho de cabelo')
    name = name.replace(`Laco de cabelo`, 'Lacinho de cabelo')
    name = name.replace(`magico`, 'mágico')
    name = name.replace(`Marcadores`, 'Marcador')
    name = name.replace(`Balão número 6,5`, 'Pacote de bola 6,5')
    name = name.replace(`aluminio`, 'alumínio')
    name = name.replace(`deliga`, 'de liga')
    name = name.replace(`Pastas`, 'Pasta')
    name = name.replace(`alcalinas`, 'alcalina')
    name = name.replace(`Piranhas`, 'Piranha')
    name = name.replace(`descartáveis`, 'descartável')
    name = name.replace(`Tinga`, 'Tinge')
    name = name.replace(`Tiaras`, 'Tiara')
    name = name.replace(` p `, ' para ')
    name = name.replace(` p/ `, ' para ')
    name = name.replace(` d `, ' de ')
    name = name.replace(` se `, ' de ')
    name = name.replace(` dr `, ' de ')
    name = name.replace(` c/ `, ' com ')
    name = name.replace(`transparentes`, 'transparente')
    name = name.replace(`Chineloa`, 'Chinelo')
    name = name.replace(`Chino`, 'Chinelo')
    name = name.replace(`agua`, 'água')
    name = name.replace(`Réguas`, 'Régua')
    name = name.replace(`Saboneteiras`, 'Saboneteira')
    name = name.replace(`lencol`, 'lençol')
    name = name.replace(`potes`, 'pote')
    name = name.replace(`Nyloon`, 'Nylon')
    name = name.replace(`Oculos`, 'Óculos')
    name = name.replace(`Oleo`, 'Óleo')
    name = name.replace(`Oléo`, 'Óleo')
    name = name.replace(`Onibus`, 'Ônibus')
    name = name.replace(`Pam9s`, 'Pano')
    name = name.replace(`Percevjo`, 'Percevejo')
    name = name.replace(`Percey`, 'Piercing')
    name = name.replace(`Percey`, 'Piercing')
    name = name.replace(`Silios`, 'Cilios')
    name = name.replace(`Slaime`, 'Slime')
    name = name.replace(`Slaim`, 'Slime')
    name = name.replace(`Tapetes`, 'Tapete')
    name = name.replace(`Tacas`, 'Taça')
    name = name.replace(`vulcao`, 'vulcão')
    name = name.replace(`smell`, 'smel')
    name = name.replace(`unicornio`, 'unicórnio')
    name = name.replace(`Cariocas`, 'Carioca')
    name = name.replace(`tuburão`, 'tubarão')
    name = name.replace(`Cinelo`, 'Chinelo')
    name = name.replace(`Chaveiros`, 'Chaveiro')
    name = name.replace(`Cartilagem tubarão`, 'Cartilagem de tubarão')
    name = name.replace(`  pressão`, ' pressão')
    name = name.replace(`Tingercor`, 'Tinge cor')
    name = name.replace(`Tingecor`, 'Tinge cor')
    name = name.replace(`Gorro de natal`, 'Gorro de papai noel')
    name = name.replace(`Gorro do papai noel`, 'Gorro de papai noel')
    name = name.replace(`Gorro natal`, 'Gorro de papai noel')
    name = name.replace(`Gorro papai noel`, 'Gorro de papai noel')
    name = name.replace(`Borracha panela 7l`, 'Borracha de panela 7l')

    if (name === 'Chinelo havaianas to' || name === 'Chinelo havaianass to')
        name = 'Chinelo havaianas top'

    name = name.replace(`  `, ' ')
    return name
}

const replaceS = (name, value) => {
    if (name.includes(`${value}s`))
        name = name.replace(`${value}s`, value)
    return name
}
const formatProduct = (p) => {
    let name = p.name.trim().toLowerCase();

    if (p.name.includes('2unid '))
        return { ...p, name, newName: capitalize(name.replace('2unid ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2caixas de pizza'))
        return { ...p, name, newName: capitalize(name.replace('2', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2festões'))
        return { ...p, name, newName: capitalize(name.replace('2festões', 'festões')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2pilhas gradnde'))
        return { ...p, name, newName: capitalize(name.replace('2pilhas gradnde', 'pilha grande')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('Xaxim grande 2unidades'))
        return { ...p, name, newName: capitalize(name.replace('Xaxim grande 2unidades', 'Xaxim grande')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2M elastico'))
        return { ...p, name, newName: capitalize(name.replace('2M elastico', 'Metro elastico')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('Piercing nariz argola(2unid)'))
        return { ...p, name, newName: capitalize(name.replace('Piercing nariz argola(2unid)', 'Piercing nariz argola')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2  pilhas'))
        return { ...p, name, newName: capitalize(name.replace('2  ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2 retroz linha 10'))
        return { ...p, name, newName: capitalize(name.replace('2 ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2 caderno de 10 matérias'))
        return { ...p, name, newName: capitalize(name.replace('2 ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('1 caderno 10 materias'))
        return { ...p, name, newName: capitalize(name.replace('1 caderno 10 materias', 'caderno de 10 matérias')), newValue: p.value, qtd: 1 }
    if (p.name.includes("'Cortina de box"))
        return { ...p, name, newName: capitalize(name.replace("'", '')), newValue: p.value, qtd: 1 }
    if (p.name.includes("1benjamim"))
        return { ...p, name, newName: capitalize(name.replace("1benjamim", 'beijamim')), newValue: p.value, qtd: 1 }

    if (p.name.includes("1 7nha postiça"))
        return { ...p, name, newName: capitalize(name.replace("1 7nha postiça", 'Unha postiça')), newValue: p.value, qtd: 1 }

    if (p.name.includes('1boneca') || p.name.includes('1borracha') || p.name.includes('1caneca') || p.name.includes('1chinelo') || p.name.includes('1dinossauro') || p.name.includes('1escova') || p.name.includes('1fisiofort') || p.name.includes('1fita') || p.name.includes('1garrafa') || p.name.includes('1massinha') || p.name.includes('1porta') || p.name.includes('1vela'))
        return { ...p, name, newName: capitalize(name.replace('1', '')), newValue: p.value, qtd: 1 }
    if (p.name.includes('2caixas') || p.name.includes('2canetinha') || p.name.includes('2chinelo') || p.name.includes('2festões') || p.name.includes('2forminhas') || p.name.includes('2pilhas') || p.name.includes('2unid') || p.name.includes('2M elastico'))
        return { ...p, name, newName: capitalize(name.replace('2', '')), newValue: p.value, qtd: 2 }
    if (p.name.includes('2 varoes 1,5'))
        return { ...p, name, newName: capitalize(name.replace('2 ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2pct de '))
        return { ...p, name, newName: capitalize(name.replace('2pct de ', 'pct de ')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('1 0ct de '))
        return { ...p, name, newName: capitalize(name.replace('1 0ct de ', 'pct de ')), newValue: p.value, qtd: 1 }
    if (p.name.includes('1 1 barbante'))
        return { ...p, name, newName: capitalize(name.replace('1 1 barbante', 'barbante')), newValue: p.value, qtd: 1 }
    if (p.name.includes('3pct de '))
        return { ...p, name, newName: capitalize(name.replace('3pct de ', 'pct de ')), newValue: p.value / 3, qtd: 3 }
    if (p.name.includes('3 pct de '))
        return { ...p, name, newName: capitalize(name.replace('3 pct de ', 'pct de ')), newValue: p.value / 3, qtd: 3 }
    if (p.name.includes('2kit de '))
        return { ...p, name, newName: capitalize(name.replace('2kit de ', 'kit de ')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('2kit de '))
        return { ...p, name, newName: capitalize(name.replace('2kit de ', 'kit de ')), newValue: p.value / 2, qtd: 2 }

    if (p.name.includes('4  kit '))
        return { ...p, name, newName: capitalize(name.replace('4  kit ', 'kit de ')), newValue: p.value / 4, qtd: 4 }
    if (p.name.includes('4saco '))
        return { ...p, name, newName: capitalize(name.replace('4saco ', 'saco ')), newValue: p.value / 4, qtd: 4 }
    if (p.name.includes('810sacos '))
        return { ...p, name, newName: capitalize(name.replace('810sacos ', 'saco ')), newValue: p.value / 10, qtd: 10 }
    if (p.name.includes('5rolos '))
        return { ...p, name, newName: capitalize(name.replace('5rolos ', 'rolo ')), newValue: p.value / 5, qtd: 5 }
    if (p.name.includes('1 varão 1,5mt'))
        return { ...p, name, newName: capitalize(name.replace('1 ', '')), newValue: p.value, qtd: 1 }
    if (p.name.includes('0,5 '))
        return { ...p, name, newName: capitalize(name.replace('0,5 ', '')), newValue: p.value * 2, qtd: 0.5 }
    if (p.name.includes('1,5mt '))
        return { ...p, name, newName: capitalize(name.replace('1,5', '')), newValue: p.value / 1.5, qtd: 1.5 }
    if (p.name.includes('1e meio de '))
        return { ...p, name, newName: capitalize(name.replace('1e meio de ', 'MT ')), newValue: p.value / 1.5, qtd: 1.5 }
    if (p.name.includes('1,5 '))
        return { ...p, name, newName: capitalize(name.replace('1,5 ', '')), newValue: p.value / 1.5, qtd: 1.5 }
    if (p.name.includes('1.5 '))
        return { ...p, name, newName: capitalize(name.replace('1.5 meio de ', 'MT ')), newValue: p.value / 1.5, qtd: 1.5 }
    if (p.name.includes('2,5 '))
        return { ...p, name, newName: capitalize(name.replace('2,5 ', '')), newValue: p.value / 2.5, qtd: 2.5 }
    if (p.name.includes('3,5 '))
        return { ...p, name, newName: capitalize(name.replace('3,5 ', '')), newValue: p.value / 3.5, qtd: 3.5 }
    if (p.name.includes('10mt de '))
        return { ...p, name, newName: capitalize(name.replace('10mt de ', 'MT ')), newValue: p.value / 10, qtd: 10 }
    if (p.name.includes('3mt de '))
        return { ...p, name, newName: capitalize(name.replace('3mt de ', 'MT ')), newValue: p.value / 3, qtd: 3 }
    if (p.name.includes('5,5 '))
        return { ...p, name, newName: capitalize(name.replace('5,5 ', '')), newValue: p.value / 5.5, qtd: 5.5 }
    if (p.name.includes('03 '))
        return { ...p, name, newName: capitalize(name.replace('03 ', '')), newValue: p.value / 3, qtd: 3 }
    if (p.name.includes('06 '))
        return { ...p, name, newName: capitalize(name.replace('06 ', '')), newValue: p.value / 6, qtd: 6 }
    if (p.name.includes('100 '))
        return { ...p, name, newName: capitalize(name.replace('100 ', '')), newValue: p.value / 100, qtd: 100 }
    if (p.name.includes('110 '))
        return { ...p, name, newName: capitalize(name.replace('110 ', '')), newValue: p.value / 110, qtd: 110 }

    if (p.name.includes('10 '))
        return { ...p, name, newName: capitalize(name.replace('10 ', '')), newValue: p.value / 10, qtd: 10 }
    if (p.name.includes('11 '))
        return { ...p, name, newName: capitalize(name.replace('11 ', '')), newValue: p.value / 11, qtd: 11 }
    if (p.name.includes('12 '))
        return { ...p, name, newName: capitalize(name.replace('12 ', '')), newValue: p.value / 12, qtd: 12 }
    if (p.name.includes('13 '))
        return { ...p, name, newName: capitalize(name.replace('13 ', '')), newValue: p.value / 13, qtd: 13 }
    if (p.name.includes('14 '))
        return { ...p, name, newName: capitalize(name.replace('14 ', '')), newValue: p.value / 14, qtd: 14 }
    if (p.name.includes('15 '))
        return { ...p, name, newName: capitalize(name.replace('15 ', '')), newValue: p.value / 15, qtd: 15 }
    if (p.name.includes('16 '))
        return { ...p, name, newName: capitalize(name.replace('16 ', '')), newValue: p.value / 16, qtd: 16 }
    if (p.name.includes('17 '))
        return { ...p, name, newName: capitalize(name.replace('17 ', '')), newValue: p.value / 17, qtd: 17 }
    if (p.name.includes('18 '))
        return { ...p, name, newName: capitalize(name.replace('18 ', '')), newValue: p.value / 18, qtd: 18 }
    if (p.name.includes('19 '))
        return { ...p, name, newName: capitalize(name.replace('19 ', '')), newValue: p.value / 19, qtd: 19 }
    if (p.name.includes('20 '))
        return { ...p, name, newName: capitalize(name.replace('20 ', '')), newValue: p.value / 20, qtd: 20 }
    if (p.name.includes('21 '))
        return { ...p, name, newName: capitalize(name.replace('21 ', '')), newValue: p.value / 21, qtd: 21 }
    if (p.name.includes('22 '))
        return { ...p, name, newName: capitalize(name.replace('22 ', '')), newValue: p.value / 22, qtd: 22 }
    if (p.name.includes('25 '))
        return { ...p, name, newName: capitalize(name.replace('25 ', '')), newValue: p.value / 25, qtd: 25 }
    if (p.name.includes('30 '))
        return { ...p, name, newName: capitalize(name.replace('30 ', '')), newValue: p.value / 30, qtd: 30 }
    if (p.name.includes('32 '))
        return { ...p, name, newName: capitalize(name.replace('32 ', '')), newValue: p.value / 32, qtd: 32 }
    if (p.name.includes('36 '))
        return { ...p, name, newName: capitalize(name.replace('36 ', '')), newValue: p.value / 36, qtd: 36 }
    if (p.name.includes('40 ') && !p.name.includes('/40 '))
        return { ...p, name, newName: capitalize(name.replace('40 ', '')), newValue: p.value / 40, qtd: 40 }
    if (p.name.includes('54 '))
        return { ...p, name, newName: capitalize(name.replace('54 ', '')), newValue: p.value / 54, qtd: 54 }
    if (p.name.includes('1 '))
        return { ...p, name, newName: capitalize(name.replace('1 ', '')), newValue: p.value, qtd: 1 }
    if (p.name.includes('2 '))
        return { ...p, name, newName: capitalize(name.replace('2 ', '')), newValue: p.value / 2, qtd: 2 }
    if (p.name.includes('3 '))
        return { ...p, name, newName: capitalize(name.replace('3 ', '')), newValue: p.value / 3, qtd: 3 }
    if (p.name.includes('4 '))
        return { ...p, name, newName: capitalize(name.replace('4 ', '')), newValue: p.value / 4, qtd: 4 }
    if (p.name.includes('5 '))
        return { ...p, name, newName: capitalize(name.replace('5 ', '')), newValue: p.value / 5, qtd: 5 }
    if (p.name.includes('6 '))
        return { ...p, name, newName: capitalize(name.replace('6 ', '')), newValue: p.value / 6, qtd: 6 }
    if (p.name.includes('7 '))
        return { ...p, name, newName: capitalize(name.replace('7 ', '')), newValue: p.value / 7, qtd: 7 }
    if (p.name.includes('8 '))
        return { ...p, name, newName: capitalize(name.replace('8 ', '')), newValue: p.value / 8, qtd: 8 }
    if (p.name.includes('9 '))
        return { ...p, name, newName: capitalize(name.replace('9 ', '')), newValue: p.value / 9, qtd: 9 }

    return { ...p, name, newName: capitalize(name), newValue: p.value, qtd: 1 }
}

const order = (data, key) => {
    return data.sort(function (a, b) {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    });
};

module.exports = { listProducts }