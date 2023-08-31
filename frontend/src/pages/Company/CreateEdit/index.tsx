import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Divider, notification, UploadFile } from 'antd';
import { Input, InputPassword, Switch } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import AccessType from 'pages/User/CreateEdit/AccessType';
import UploadImages from 'components/UploadImages';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.companies}/${id}`);
      dispatch({ ...resp.data });
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
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.companies, {
        ...state,
        fileList
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.companies}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} empresa`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={6} md={6} sm={12} xs={24}>
        <Input
          label={'Nome'}
          required={true}
          value={state.name}
          onChange={(e) => dispatch({ name: e.target.value })}
        />
      </Col>
      <Col lg={6} md={6} sm={12} xs={24}>
        <Input
          label={'Email'}
          required={true}
          type={'email'}
          value={state.email}
          onChange={(e) => dispatch({ email: e.target.value })}
        />
      </Col>
      <Col lg={6} md={6} sm={12} xs={24}>
        <Input
          label={'Telefone'}
          required={true}
          type={'tel'}
          value={state.phone}
          onChange={(e) => dispatch({ phone: e.target.value })}
        />
      </Col>
      <Col lg={6} md={6} sm={12} xs={24}>
        <Input
          label={'Chave PIX'}
          maxLength={100}
          value={state.pixKey}
          onChange={(e) => dispatch({ pixKey: e.target.value })}
        />
      </Col>
      <Col
        lg={6}
        md={12}
        sm={24}
        xs={24}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <UploadImages setFileList={setFileList} fileList={fileList} />
      </Col>
      <Col lg={3} md={4} sm={24} xs={24}>
        <Switch
          label={'Ativa'}
          title="Não / Sim"
          checked={state.active}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ active: !state.active })}
        />
      </Col>
      <Col lg={4} md={8} sm={24} xs={24}>
        <Switch
          label={'Comissão individual'}
          title="Não / Sim"
          checked={state.individualCommission}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ individualCommission: !state.individualCommission })}
        />
      </Col>
      <Col lg={8} md={8} sm={24} xs={24}>
        <Switch
          label={'Integação com API de vendas vivino'}
          title="Não / Sim"
          checked={state.vivinoApiIntegrationActive}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({
              vivinoApiIntegrationActive: !state.vivinoApiIntegrationActive
            })
          }
        />
      </Col>
      {state.vivinoApiIntegrationActive && (
        <>
          <Divider>Credênciais Vivino</Divider>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Código'}
              type={'tel'}
              value={state.vivinoId}
              onChange={(e) => dispatch({ vivinoId: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Client Id'}
              value={state.vivinoClientId}
              onChange={(e) => dispatch({ vivinoClientId: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Client secret'}
              value={state.vivinoClientSecret}
              onChange={(e) => dispatch({ vivinoClientSecret: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Username'}
              type={'email'}
              value={state.vivinoClientUsername}
              onChange={(e) =>
                dispatch({ vivinoClientUsername: e.target.value })
              }
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <InputPassword
              label={'Senha'}
              value={state.vivinoPassword}
              onChange={(e) => dispatch({ vivinoPassword: e.target.value })}
            />
          </Col>
        </>
      )}
      <AccessType
        groupsSelecteds={state.groupsFormatted}
        setGroupsSelecteds={(groupsFormatted: string[]) =>
          dispatch({ groupsFormatted })
        }
      />
    </PanelCrud>
  );
};

export default CreateEdit;
