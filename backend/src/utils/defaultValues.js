"use strict";

const roules = {
    administrator: 'administrador',
    users: 'usuarios',
    romanians: 'romaneios',
    products: 'produtos',
    wines: 'vinhos',
    sales: 'vendas',
    saleUserIdChange: 'vendedor_vendas',
    expenses: 'despesas',
};

const cognito = {
    adminEnableUser: 'adminEnableUser',
    adminDisableUser: 'adminDisableUser',
    adminSetUserPassword: 'adminSetUserPassword',
    listUsers: 'listUsers',
    adminListGroupsForUser: 'adminListGroupsForUser',
    adminCreateUser: 'adminCreateUser',
    adminUpdateUserAttributes: 'adminUpdateUserAttributes',
    adminDeleteUser: 'adminDeleteUser',
    adminAddUserToGroup: 'adminAddUserToGroup',
    adminRemoveUserFromGroup: 'adminRemoveUserFromGroup',
    listUsersInGroup: 'listUsersInGroup'
}

const companyIdDefault = '723f5715-3d2e-4484-8eb1-d24927a78c55' // Ari delicatessen

module.exports = { roules, cognito, companyIdDefault }