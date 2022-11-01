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
module.exports = { Status, sendTypeEnum, messageTypeEnum, roules, AutomaticMessageUnityEnum, cognito }