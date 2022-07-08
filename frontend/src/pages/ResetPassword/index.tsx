import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, notification } from 'antd';
import { InputPassword, Input } from 'components/_inputs';
import { Container, Content, Form } from '../Login/styles';
import useFormState from 'hooks/useFormState';
import { initialStateForm, Reset } from './interfaces';
import { onError } from 'utils/errorLib';
import Logo from 'components/Logo';

const ResetPassword: React.FC<Reset> = ({ login }) => {
  const { state, dispatch } = useFormState(initialStateForm);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const action = async (event: any) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        const { code, password } = state;
        setLoading(true);
        await Auth.forgotPasswordSubmit(login, code, password);
        await Auth.signIn(login, password);
        notification.success({
          message: `Sua senha foi alterada com sucesso`,
          placement: 'topRight'
        });
        history.push('/login');
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

    if (state.password.length < limit) {
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
          <Logo />
          <h1>Redifinir senha</h1>
          <Input
            type={'tel'}
            placeholder="Código de verificação"
            size="large"
            value={state.code}
            onChange={(e) => dispatch({ code: e.target.value })}
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
          <Link to={'/login'}>Login</Link>
        </Form>
      </Content>
    </Container>
  );
};

export default ResetPassword;
