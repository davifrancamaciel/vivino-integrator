import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

const PageNotFound: React.FC = () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="OH OH! Você está perdido"
      subTitle="A página que você está procurando não existe. Como você chegou aqui é um
      mistério. Mas você pode clicar no botão abaixo para voltar à página
      inicial."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          Voltar para o dashboard
        </Button>
      }
    />
  );
};

export default PageNotFound;
