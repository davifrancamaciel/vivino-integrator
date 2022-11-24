"use strict";

const Status = {
    AGUARDANDO_APROVACAO: 'AA', //Aguardando aprovação
    APROVADA: 'AP', //Aprovada
    ENVIADA: 'EN', //Eviada
    CANCELADA: 'CA', //Cancelada  
    REPROVADA: 'RP', //Reprovada
    ERRO_ENVIO: 'ER', // Erro de envio
    ENVIADA_AUTO: 'EA', // Envida automaticamente,
    ENVIO_AUTO_CONCLUIDO: 'EC', // Envida automaticamente,
};

const sendTypeEnum = {
    GROUPS: 'groups',
    BROADCAST: 'broadcast'
};

const messageTypeEnum = {
    EMGR: 'EMGR',
    FORCED_ALL: 'ForcedAll',
    FORCED_AT: 'ForcedAt',
    MAIL_BOX: 'MailBox'
};

const AutomaticMessageUnityEnum = {
    MINUTE: 'MINUTE',
    HOUR: 'HOUR',
    DAY: 'DAY',
    MONTH: 'MONTH',
    YEAR: 'YEAR'
};

const roules = {
    administrator: 'administrador',
    users: 'usuarios',
    romanians: 'romaneios',
    products: 'produtos',
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
const particularUsers = {
    userIdTha: '623be749-c4d7-4987-bb3d-5bdd1d810223',
    userIdSa: '7eaed82d-72e2-40c6-9de9-117f324f5530',
    userIdRe: '089c0e53-ebd7-444f-a8ec-4856475ecef7'
};
module.exports = { Status, sendTypeEnum, messageTypeEnum, roules, AutomaticMessageUnityEnum, cognito, particularUsers }