import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, notification } from 'antd';
import { InputPassword } from 'components/_inputs';
import { Container, Content, Form } from '../Login/styles';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from './interfaces';
import { onError } from 'utils/errorLib';

const ChangePassword: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateForm);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const action = async (event: any) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        const { oldPassword, password } = state;
        setLoading(true);
        const currentUser = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(currentUser, oldPassword, password);
        notification.success({
          message: `Sua senha foi alterada com sucesso`,
          placement: 'topRight'
        });
        history.push('/');
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: onError(error),
        placement: 'topRight'
      });
    }
  };

  const validateForm = () => {
    let message = '';
    const limit = 8;
    if (state.oldPassword.length == 0) {
      message = 'O campo senha atual deve ser preenchido';
    }
    if (!message && state.password.length < limit) {
      message = `O campo nova senha deve ser preenchido com ${limit} ou mais caracteres`;
    }
    if (!message && state.confirmPassword.length < limit) {
      message = `O campo confirmação de senha deve ser preenchido com ${limit} ou mais caracteres`;
    }
    if (!message && state.password !== state.confirmPassword) {
      message = 'O campo nova senha e confirmação de senha devem ser iguais';
    }

    message && notification.warning({ message, placement: 'topRight' });
    return !!!message;
  };
  return (
    <Container>
      <Content>
        <Form onSubmit={action}>
          <InputPassword
            placeholder="Senha atual"
            size="large"
            value={state.oldPassword}
            onChange={(e) => dispatch({ oldPassword: e.target.value })}
          />
          <InputPassword
            placeholder="Nova senha"
            size="large"
            value={state.password}
            onChange={(e) => dispatch({ password: e.target.value })}
          />
          <InputPassword
            placeholder="Confirmar senha"
            size="large"
            value={state.confirmPassword}
            onChange={(e) => dispatch({ confirmPassword: e.target.value })}
          />

          <Button
            htmlType={'submit'}
            type="primary"
            loading={loading}
            size="large"
            block
          >
            {!loading ? 'Alterar senha' : ''}
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default ChangePassword;
