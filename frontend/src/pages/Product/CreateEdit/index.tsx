import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, UploadFile } from 'antd';
import { Input, Select, Switch, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import ShowByRoule from 'components/ShowByRoule';
import UploadImages from 'components/UploadImages';
import { formatNumberWhithDecimalCaseOnChange } from 'utils/formatPrice';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    console.log(state);
  }, [state]);
  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.products}/${id}`);
      dispatch({
        ...resp.data,
        price: formatNumberWhithDecimalCaseOnChange(resp.data?.price || 0)
      });
      if (resp.data && resp.data.image) {
        const imageArr = resp.data.image.split('/');
        setFileList([
          {
            uid: '-1',
            name: imageArr[imageArr.length - 1],
            status: 'done',
            url: resp.data.image
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name || !state.price) {
        const message = 'Existem campos obrigatórios não preenchidos';
        notification.warning({ message });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.products, {
        ...state,
        fileList
      });
      setLoading(false);

      result.success && history.push(`/${appRoutes.products}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} produto`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Select
            label={'Empresa'}
            url={`${apiRoutes.companies}/all`}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col
        lg={6}
        md={12}
        sm={24}
        xs={24}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <UploadImages setFileList={setFileList} fileList={fileList} />
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Input
          label={'Nome do produto'}
          required={true}
          placeholder="Bola"
          value={state.name}
          onChange={(e) => dispatch({ name: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Preço'}
          required={true}
          type={'tel'}
          placeholder="15.00"
          value={state.price}
          onChange={(e) =>
            dispatch({
              price: formatNumberWhithDecimalCaseOnChange(e.target.value)
            })
          }
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Tamanho'}
          placeholder="P, 34/35, 1L ..."
          value={state.size}
          onChange={(e) => dispatch({ size: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Estoque'}
          type={'number'}
          placeholder="1"
          value={state.inventoryCount}
          onChange={(e) => dispatch({ inventoryCount: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Cor'}
          maxLength={100}
          placeholder="Branco"
          value={state.color}
          onChange={(e) => dispatch({ color: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Código de barras'}
          maxLength={100}
          type={'number'}
          placeholder="9334612000037"
          value={state.ean}
          onChange={(e) => dispatch({ ean: e.target.value })}
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Select
          label={'Categoria'}
          url={`${apiRoutes.categories}/all`}
          value={state.categoryId}
          onChange={(categoryId) => dispatch({ categoryId })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Switch
          label={'Ativo'}
          title="Inativo / Ativo"
          checked={state.active}
          checkedChildren="Ativo"
          unCheckedChildren="Inativo"
          onChange={() => dispatch({ active: !state.active })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
