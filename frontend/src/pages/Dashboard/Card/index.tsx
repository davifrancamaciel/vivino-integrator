import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { CardPropTypes } from './interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes } from 'utils/defaultValues';

import { Container } from './styles';

const Card: React.FC<CardPropTypes> = (props) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    action();
  }, []);

  const action = async () => {
    try {
      setLoading(true);
      const url = `${apiRoutes.dashboard}/products-by-status/${props.active}`;
      const resp = await api.get(url);
      setCount(resp.data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Link
      to={
        props.isPermission
          ? `${appRoutes.products}?active=${props.active}`
          : '/'
      }
    >
      <Container color={props.color}>
        <span>{loading ? <LoadingOutlined /> : count}</span>
        <strong>{props.text}</strong>
        <div>{props.icon}</div>
      </Container>
    </Link>
  );
};

export default Card;
