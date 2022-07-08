import React from 'react';
import { useHistory } from 'react-router-dom';

import { ArrowLeftOutlined } from '@ant-design/icons';

import { Container } from './styles';

const GoBack: React.FC = () => {
  const history = useHistory();

  return (
    <Container onClick={() => history.goBack()}>
      <ArrowLeftOutlined /> Voltar
    </Container>
  );
};

export default GoBack;
