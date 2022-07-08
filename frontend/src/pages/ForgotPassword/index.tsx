import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'components/_inputs';
import useFormState from 'hooks/useFormState';
import { Container, Content, Form } from '../Login/styles';
import Logo from 'components/Logo';
import { onError } from 'utils/errorLib';
import ResetPassword from '../ResetPassword';

const Forgot: React.FC = () => {
  const { state, dispatch } = useFormState({ login: '' });
  const [loading, setLoading] = useState(false);
  const [codeSend, setCodeSend] = useState(false);

  const action = async (event: any) => {
    event.preventDefault();
    try {
      if (!state.login) {
        return;
      }
      setLoading(true);
      await Auth.forgotPassword(state.login);
      setLoading(false);
      notification.success({
        message: `Código enviado com sucesso`,
        placement: 'topRight'
      });
      setCodeSend(true);
    } catch (error) {
      setCodeSend(false);
      setLoading(false);
      notification.error({
        message: onError(error),
        placement: 'topRight'
      });
    }
  };

  return codeSend ? (
    <ResetPassword login={state.login} />
  ) : (
    <Container>
      <Content>
        <Form onSubmit={action}>
          <Logo />
          <h1>Esqueci minha senha</h1>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Login"
            size="large"
            value={state.login}
            onChange={(e) => dispatch({ login: e.target.value })}
          />

          <Button
            htmlType={'submit'}
            type="primary"
            loading={loading}
            size="large"
            block
          >
            {!loading ? 'Enviar código' : ''}
          </Button>
          <Link to={'/login'}>Login</Link>
        </Form>
      </Content>
    </Container>
  );
};

export default Forgot;
