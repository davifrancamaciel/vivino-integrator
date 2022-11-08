import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';

import { Button, Col, Row } from 'antd';
import { Input } from 'components/_inputs';
import { PropTypes, Product } from './interfaces';
import { systemColors } from 'utils/defaultValues';
import { formatValueWhithDecimalCaseOnChange } from 'utils/formatPrice';

const Products: React.FC<PropTypes> = ({ products, setProducts }) => {
  useEffect(() => {
    !products.length && setProducts([{ id: uuidv4() } as Product]);
  }, [products]);

  const change = (p: Product) => {
    const newProducts = products.map((product: Product) => {
      return product.id === p.id ? p : product;
    });
    setProducts(newProducts);
  };
  const add = () => {
    setProducts([...products, { id: uuidv4() } as Product]);
  };
  const remove = (p: Product) => {
    const newProducts = products.filter(
      (product: Product) => product.id !== p.id
    );
    setProducts(newProducts);
  };
  return (
    <Col lg={24} md={24} sm={24} xs={24}>
      {products?.map((p: Product, index: number) => (
        <Row gutter={[16, 24]} key={index} style={{ marginBottom: '15px' }}>
          <Col lg={16} md={24} sm={24} xs={24}>
            <Input
              label={'Produto'}
              placeholder="Bola"
              value={p.name}
              onChange={(e) => change({ ...p, name: e.target.value })}
            />
          </Col>
          <Col lg={6} md={20} sm={20} xs={20}>
            <Input
              label={'Valor'}
              type={'tel'}
              placeholder="15,00"
              value={p.value}
              onChange={(e) => change({ ...p, value: formatValueWhithDecimalCaseOnChange(e.target.value) })}
            />
          </Col>
          {index === products.length - 1 && (
            <Col lg={2} md={4} sm={4} xs={4}>
              <Button
                style={{
                  color: '#fff',
                  backgroundColor: systemColors.GREEN,
                  marginRight: 4,
                  bottom: 0,
                  position: 'absolute'
                }}
                icon={<PlusSquareOutlined />}
                onClick={() => add()}
              />
            </Col>
          )}
          {index !== products.length - 1 && (
            <Col lg={2} md={4} sm={4} xs={4}>
              <Button
                style={{
                  color: '#fff',
                  backgroundColor: systemColors.RED,
                  marginRight: 4,
                  bottom: 0,
                  position: 'absolute'
                }}
                icon={<DeleteOutlined />}
                onClick={() => remove(p)}
              />
            </Col>
          )}
        </Row>
      ))}
    </Col>
  );
};

export default Products;
