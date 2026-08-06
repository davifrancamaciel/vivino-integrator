import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { ContainerCard } from './styles';

interface CardPropTypes {
  text: string;
  loading: boolean;
  value: string;
  color?: string;
  icon?: any;
  width?: number;
}

const Card: React.FC<CardPropTypes> = (props) => {
  return (
    <ContainerCard color={props.color} width={props.width}>
      <span>
        {props.loading ? <LoadingOutlined /> : props.value ? props.value : 0}
      </span>
      <strong>{props.text}</strong>
      <div>{props.icon}</div>
    </ContainerCard>
  );
};

export default Card;
