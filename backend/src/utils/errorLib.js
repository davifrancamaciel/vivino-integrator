"use strict";

const onError = (error) => {
  console.log(error);
  let message = error.toString();
  const errors = {
    UserNotFoundException: 'Usuário não encontrado.',
    UserNotConfirmedException: 'Cadastro ainda não foi confirmado.',
    PasswordResetRequiredException: 'Usuários ou senhas inválidos.',
    NotAuthorizedException: 'Usuários ou senhas inválidos.',
    InvalidPasswordException:
      'A senha é fraca, tente incluir letras maiúsculas e minúsculas, números e caracteres especiais.',
    LimitExceededException:
      'Muitas tentativas de alterar a senha. Aguarde um tempo e tente novamente.',
    UsernameExistsException: 'Já existe um usuario com este login',
    InvalidParameterException:
      'Não é possível redefinir a senha do usuário, pois não há e-mail ou número de telefone registrado/verificado',
    CodeMismatchException: 'O código de verificação informado é invalido'
  };

  // Auth errors
  if (error.message && error.code) {
    message = error.message;

    if (errors[error.code]) {
      message = errors[error.code];
    }
    
    return message
  }

  return undefined;
}

module.exports = onError
