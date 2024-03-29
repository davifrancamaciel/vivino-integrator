import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { CardPropTypes } from './interfaces';
import { Container } from './styles';

const Card: React.FC<CardPropTypes> = (props) => {
  return (
    <Link to={props.url}>
      <Container color={props.color}>
        <span>
          {props.loading ? <LoadingOutlined /> : props.value ? props.value : 0}
        </span>
        <strong>{props.text}</strong>
        <div>{props.icon}</div>
      </Container>
    </Link>
  );
};

export default Card;
