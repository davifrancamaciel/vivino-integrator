import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Input, InputPassword } from 'components/_inputs';
import useFormState from 'hooks/useFormState';
import { Container, Content, Form } from './styles';
import { initialStateForm } from './interfaces';
import { onError } from 'utils/errorLib';
import { useAppContext } from 'hooks/contextLib';
import { useQuery } from 'hooks/queryString';

import { enumStatusUserAws } from 'utils/defaultValues';
import Logo from 'components/Logo';

const Login: React.FC = () => {
  const query = useQuery();
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);

  const action = async (event: any) => {
    event.preventDefault();
    try {
      const { login, password } = state;
      if (!login || !password) {
        return;
      }
      setLoading(true);
      const result = await Auth.signIn(login, password);
      if (result.challengeName === enumStatusUserAws.NEW_PASSWORD_REQUIRED) {
        notification.info({
          message: 'Primeiro acesso. Seja bem vindo',
          description: 'Não se esqueça de trocar sua senha!',
          duration: 7
        });
        const { userAttributes } = result.challengeParam;
        let { name } = userAttributes;
        if (!name) {
          name = login;
        }
        await Auth.completeNewPassword(result, password, { name });
        notification.info({
          message: 'Só mais um instante',
          description: 'Estamos te autenticando',
          duration: 7
        });
        await Auth.signIn(login, password);
      }

      setLoading(false);

      query.get('r') ? history.push(query.get('r')) : history.push(`/`);

      userHasAuthenticated(true);
    } catch (error: any) {
      setLoading(false);
      notification.error({
        message: onError(error),
        description: error.message
      });
    }
  };

  return (
    <Container>
      <Content>
        <Form onSubmit={action}>
          <Logo />
          <h1>Login</h1>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Login"
            size="large"
            value={state.login}
            onChange={(e) => dispatch({ login: e.target.value })}
          />
          <InputPassword
            placeholder="Senha"
            size="large"
            value={state.password}
            onChange={(e) => dispatch({ password: e.target.value })}
          />
          <Button
            htmlType={'submit'}
            type="primary"
            loading={loading}
            size="large"
            block
            onSubmit={action}
          >
            {!loading ? 'Entrar' : ''}
          </Button>
          <Link to={'/forgot-password'}>Esqueceu a senha?</Link>
          <a
            href="https://api.whatsapp.com/send?phone=5524993954479&text=Olá, desejo criar uma conta no Integrador Vivino"
            target={'_blank'}
          >
            Criar conta
          </a>
        </Form>
      </Content>
    </Container>
  );
};

export default Login;
