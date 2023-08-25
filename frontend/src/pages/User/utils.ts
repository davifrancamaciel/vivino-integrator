import { UserCognito, UserCognitoAttribute, Users } from './interfaces';

export const mapUser = (user: UserCognito): Users => {
  return {
    id: findAttribute(user.Attributes, 'sub'),
    name: findAttribute(user.Attributes, 'name'),
    email: findAttribute(user.Attributes, 'email'),
    companyId: findAttribute(user.Attributes, 'custom:company_id'),
    accessType: user.Groups,
    // login: user.Username,
    status: user.Enabled,
    userStatusText: user.UserStatus,
    type: 'USER',
    dayMaturityFavorite: 0
  };
};

const findAttribute = (array: UserCognitoAttribute[], name: string) => {
  const obj = array.find((a: UserCognitoAttribute) => a.Name === name);
  return obj ? obj.Value : '';
};
