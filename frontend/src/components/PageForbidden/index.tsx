import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

const PageForbidden: React.FC = () => {
  const history = useHistory();
  return (
    <Result
      status="403"
      title="OH OH! Você está acessando uma área restrita"
      subTitle="A página que você está tentando acessar é restrita a alguns usuários.
      Para obter o acesso você deve solicitar permissão a um administrador do
      sistema."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          Voltar para o dashboard
        </Button>
      }
    />
  );
};

export default PageForbidden;
