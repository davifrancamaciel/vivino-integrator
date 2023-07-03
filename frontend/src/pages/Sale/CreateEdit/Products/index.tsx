import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';

import { Button, Col, Row } from 'antd';
import { Input, Select } from 'components/_inputs';
import { PropTypes } from './interfaces';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import {
  formatPrice,
  formatNumberWhithDecimalCaseOnChange
} from 'utils/formatPrice';
import api from 'services/api-aws-amplify';
import { SaleProduct, Product } from '../../interfaces';
import { IOptions } from '../../../../utils/commonInterfaces';

const Products: React.FC<PropTypes> = ({ products, setProducts }) => {
  const [loading, setLoading] = useState(false);
  const [productsOptions, setProductsOptions] = useState<Product[]>([]);
  const [options, setOptions] = useState<IOptions[]>([]);
  useEffect(() => {
    onLoad();
  }, []);
  useEffect(() => {
    !products.length && add();
  }, [products]);
  
  const changeProduct = (sp: SaleProduct) => {
    const newProducts = products.map((product: SaleProduct) => {
      return product.id === sp.id ? newProduct(sp) : product;
    });
    setProducts(newProducts);
  };

  const newProduct = (sp: SaleProduct) => {
    const product = productsOptions.find((p: Product) => p.id === sp.productId);
    return {
      product,
      id: sp.id,
      productId: product?.id,
      value: product?.price,
      amount: 1,
      valueAmount: product?.price
    } as SaleProduct;
  };

  const changeAmount = (sp: SaleProduct) => {
    const newProducts = products.map((product: SaleProduct) => {
      return product.id === sp.id
        ? {
            ...product,
            amount: formatNumberWhithDecimalCaseOnChange(sp.amountStr),
            value: sp?.value,
            valueAmount:
              formatNumberWhithDecimalCaseOnChange(sp.amountStr) *
              product?.value
          }
        : product;
    });
    setProducts(newProducts);
  };

  const changeValue = (sp: SaleProduct) => {
    const newProducts = products.map((product: SaleProduct) => {
      return product.id === sp.id
        ? {
            ...product,
            amount: sp.amount,
            value: formatNumberWhithDecimalCaseOnChange(sp?.valueStr),
            valueAmount:
              sp.amount * formatNumberWhithDecimalCaseOnChange(sp?.valueStr)
          }
        : product;
    });
    setProducts(newProducts);
  };

  const add = () => {
    setProducts([...products, { id: uuidv4() } as SaleProduct]);
  };

  const remove = (p: SaleProduct) => {
    const newProducts = products.filter(
      (product: SaleProduct) => product.id !== p.id
    );
    setProducts(newProducts);
  };

  const onLoad = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.products}/all`);

      setOptions(resp.data.map((x: IOptions) => x));
      setProductsOptions(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Col lg={24} md={24} sm={24} xs={24}>
      {products?.map((p: SaleProduct, index: number) => (
        <Row gutter={[16, 24]} key={index} style={{ marginBottom: '15px' }}>
          <Col lg={12} md={24} sm={24} xs={24}>
            <Select
              label={'Produto'}
              options={options}
              loading={loading}
              value={p.productId}
              onChange={(productId) => changeProduct({ ...p, productId })}
            />
          </Col>
          <Col lg={3} md={12} sm={12} xs={12}>
            <Input
              label={'Qtd'}
              type={'tel'}
              placeholder="15,00"
              value={p.amount}
              onChange={(e) =>
                changeAmount({ ...p, amountStr: e.target.value })
              }
            />
          </Col>
          <Col lg={3} md={12} sm={12} xs={12}>
            <Input
              label={'Valor'}
              type={'tel'}
              placeholder="15,00"
              value={p.value}
              onChange={(e) => changeValue({ ...p, valueStr: e.target.value })}
            />
          </Col>
          <Col lg={4} md={20} sm={20} xs={20}>
            <Input
              label={'Total'}
              value={formatPrice(p.valueAmount || 0)}
              disabled
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
