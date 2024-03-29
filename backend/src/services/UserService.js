const { cognitoRequest } = require("./AwsCognitoService");
const { roules, cognito } = require("../utils/defaultValues");

const findUserById = async (id) => {
    const result = await cognitoRequest(cognito.listUsers, { Filter: `sub = "${id}"` });
    if (!result.Users.length)
        return undefined

    const [user] = result.Users
    return user;
}

const getUser = async (event) => {
    try {

        const { requestContext } = event
        if (!requestContext)
            return null
        const { user } = requestContext.authorizer

        if (user) {
            const userToken = JSON.parse(user)            
            userToken.groups = userToken["cognito:groups"];
            userToken.companyId = userToken["custom:company_id"];
            userToken.userId = Number(userToken["custom:user_id"] || 0);
            console.log('USUÁRIO ', userToken.name)
            return userToken
        } else
            return null

    } catch (error) {
        console.log('Erro ao recuperar usuário', error)
        return null;
    }
}

const checkRouleProfileAccess = (groups, roule) => {
    try {
        if (!!groups) {
            const isAdministrator = groups.find(
                (r) =>
                    r.toLocaleLowerCase() === roules.administrator.toLocaleLowerCase()
            );
            if (isAdministrator) return isAdministrator;

            return groups.find(
                (r) => r.toLocaleLowerCase() === roule.toLocaleLowerCase()
            );
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

const mapUser = (user) => {
    return {
        id: findAttribute(user.Attributes, 'sub'),
        name: findAttribute(user.Attributes, 'name'),
        email: findAttribute(user.Attributes, 'email'),
        accessTypeText: findAttribute(user.Attributes, 'custom:type_access'),
        accessType: user.Groups,
        login: user.Username,
        status: user.Enabled,
        userStatusText: user.UserStatus,
    };
};

const findAttribute = (array, name) => {
    const obj = array.find((a) => a.Name === name);
    return obj ? obj.Value : '';
};

module.exports = { findUserById, getUser, mapUser, checkRouleProfileAccess }