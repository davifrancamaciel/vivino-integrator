import { roules } from './defaultValues';

// checa se o perfil do usuario logado possui a roule passada como parametro no token de autenticação para dar acesso ao iten no front
export const checkRouleProfileAccess = (groups: string[], roule: string) => {
  try {
    if (!!groups) {
      const isAdministrator = groups.find(
        (r: string) =>
          r.toLocaleLowerCase() === roules.administrator.toLocaleLowerCase()
      );
      if (isAdministrator) return isAdministrator;

      return groups.find(
        (r: string) => r.toLocaleLowerCase() === roule.toLocaleLowerCase()
      );
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
