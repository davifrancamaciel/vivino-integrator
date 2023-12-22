import React from 'react';
import { WhatsAppOutlined } from '@ant-design/icons';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  phone?: string;
  text?: string;
  mesage?: string;
}

const WhatsApp: React.FC<PropTypes> = ({ phone, text, mesage }) => {
  if (phone) {
    const sendPhone = phone
      .replace('+55', '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
      .replace(',', '')
      .replace('+', '')
      .replace('*', '')
      .replace(' ', '')
      .replace(' ', '')
      .replace(' ', '')
      .replace(' ', '')
      .trim();
    const propMessage = mesage ? `&text=${mesage}` : '';
    return (
      <div>
        <WhatsAppOutlined color={systemColors.GREEN} />
        <a
          href={`https://api.whatsapp.com/send?phone=55${sendPhone}${propMessage}`}
          target={'_blank'}
        >
          {` `} {text ? text : phone}
        </a>
      </div>
    );
  }
  return <div />;
};

export default WhatsApp;
