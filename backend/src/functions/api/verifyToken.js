const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var jwkToPem = require('jwk-to-pem');
const { getKeys } = require("../../services/AwsCognitoService");

const generatePolicy = (decoded, effect, resource) => {
    try {
        const authResponse = {};
        authResponse.principalId = decoded.sub;

        if (effect && resource) {
            const policyDocument = {};
            policyDocument.Version = '2012-10-17';
            policyDocument.Statement = [];
            const statementOne = {};
            statementOne.Action = 'execute-api:Invoke';
            statementOne.Effect = effect;
            statementOne.Resource = resource;
            policyDocument.Statement[0] = statementOne;
            authResponse.policyDocument = policyDocument;
        }
        authResponse.context = {
            user: JSON.stringify(decoded)
        };

        return authResponse;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

module.exports.auth = async (event, context, callback) => {
    try {

        const token = event.authorizationToken;

        if (!token)
            return callback(null, 'Unauthorized');

        var tmp = event.methodArn.split(':');
        var apiGatewayArnTmp = tmp[5].split('/');
        var resource = `${tmp[0]}:${tmp[1]}:${tmp[2]}:${tmp[3]}:${tmp[4]}:${apiGatewayArnTmp[0]}/*/*`;

        const result = await getKeys();
        // console.log('result', result)
        if (!result)
            return callback(null, 'Unauthorized');

        const { keys } = result;
        const [jwk] = keys
        var pem = jwkToPem(jwk);
        const decoded = await verify(token, pem)

        if (!decoded)
            return callback(null, 'Unauthorized');
        else
            return callback(null, generatePolicy(decoded, 'Allow', resource))

    } catch (error) {
        console.log(error)
        return callback(error, 'Unauthorized');
    }
};

const verify = (token, pem) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, pem, (error, decoded) => {
            // console.log('decoded', decoded)
            if (error)
                reject(error);
            else
                resolve(decoded);
        });
    });
}