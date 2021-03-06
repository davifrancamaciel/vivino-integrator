import { UserCognito, UserCognitoAttribute, Users } from './interfaces';

export const mapUser = (user: UserCognito): Users => {
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

const findAttribute = (array: UserCognitoAttribute[], name: string) => {
  const obj = array.find((a: UserCognitoAttribute) => a.Name === name);
  return obj ? obj.Value : '';
};
