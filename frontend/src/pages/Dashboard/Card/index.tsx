import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { CardPropTypes } from './interfaces';
import { Container } from './styles';

const Card: React.FC<CardPropTypes> = (props) => {
  return (
    <Link to={props.isPermission ? props.url : '/'}>
      <Container color={props.color}>
        <span>{props.loading ? <LoadingOutlined /> : props.value}</span>
        <strong>{props.text}</strong>
        <div>{props.icon}</div>
      </Container>
    </Link>
  );
};

export default Card;
