import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, Tag, Tooltip, Row, UploadFile } from 'antd';
import { Input, Switch, InputPassword, Select } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import AccessType from './AccessType';
import ShowByRoule from 'components/ShowByRoule';
import UploadImages from 'components/UploadImages';

import {
  apiRoutes,
  appRoutes,
  enumStatusUserAws,
  roules,
  systemColors,
  userType
} from 'utils/defaultValues';
import BooleanTag from 'components/BooleanTag';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
    setPath(
      window.location.pathname.includes(appRoutes.clients)
        ? userType.CLIENT
        : userType.USER
    );
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/${id}`);
      const { UserAws } = resp.data;

      const itemEdit = { ...resp.data };
      if (UserAws) {
        itemEdit.status = UserAws.Enabled;
        itemEdit.accessType = UserAws.Groups;
        itemEdit.resetPassword = false;
        itemEdit.userStatusText = userStatusTag(UserAws.UserStatus);
        itemEdit.statusText = (
          <BooleanTag value={UserAws.Enabled} yes={'Ativo'} no={'Inativo'} />
        );
      }
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
      console.log(itemEdit);
      dispatch(itemEdit);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.email) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }

      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.users, {
        ...state,
        type: path,
        fileList
      });

      setLoading(false);

      result.success && history.push(`/${path.toLowerCase()}s`);
    } catch (error) {
      setLoading(false);
    }
  };

  const userStatusTag = (userStatusText: string) => {
    let color, text, title;
    switch (userStatusText) {
      case enumStatusUserAws.FORCE_CHANGE_PASSWORD:
        color = systemColors.RED;
        text = 'LOGIN NÃO CONFIRMADO';
        title = 'Quando o usuário nunca efetuou login na aplicação';
        break;
      case enumStatusUserAws.CONFIRMED:
        color = systemColors.GREEN;
        text = 'LOGIN CONFIRMADO';
        title = 'Quando o usuário efetuou login ao menos uma vez na aplicação';
        break;
      default:
        break;
    }
    return color ? (
      <Tooltip title={title}>
        <Tag color={color}>{text}</Tag>
      </Tooltip>
    ) : undefined;
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} ${
        path === userType.USER ? 'usuário' : 'cliente'
      }`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={false}
    >
      <Col lg={6} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <UploadImages setFileList={setFileList} fileList={fileList} />
          </Col>
          {type === 'update' && (
            <>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {state.statusText}
              </Col>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {state.userStatusText}
              </Col>
            </>
          )}
        </Row>
      </Col>
      <Col lg={18} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <ShowByRoule roule={roules.administrator}>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Select
                label={'Empresa'}
                url={`${apiRoutes.companies}/all`}
                value={state.companyId}
                onChange={(companyId) => dispatch({ companyId })}
              />
            </Col>
          </ShowByRoule>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Nome completo'}
              placeholder="Insira o nome completo do usuário"
              value={state.name}
              onChange={(e) => dispatch({ name: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Email'}
              required={true}
              disabled={type === 'update'}
              type={'email'}
              placeholder="Digite o email do usuário"
              value={state.email}
              onChange={(e) => dispatch({ email: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Telefone'}
              type={'tel'}
              value={state.phone}
              onChange={(e) => dispatch({ phone: e.target.value })}
            />
          </Col>
          <ShowByRoule roule={roules.sales}>
            {path === userType.USER && (
              <Col lg={8} md={8} sm={12} xs={24}>
                <Input
                  label={'Comissão'}
                  tooltip={
                    '% que será utilizada para calculo de commissões'
                  }
                  type={'tel'}
                  placeholder="Ex.: 2,5"
                  max={100}
                  min={0}
                  value={state.commissionMonth}
                  onChange={(e) =>
                    dispatch({ commissionMonth: e.target.value })
                  }
                />
              </Col>
            )}
            <Col lg={8} md={8} sm={12} xs={24}>
              <Input
                label={'Vencimento'}
                type={'number'}
                tooltip={
                  'Melhor dia de vencimento para compras ou pagamentos'
                }
                placeholder="Ex.: 5"
                max={30}
                min={0}
                value={state.dayMaturityFavorite}
                onChange={(e) =>
                  dispatch({ dayMaturityFavorite: e.target.value })
                }
              />
            </Col>
          </ShowByRoule>
          {path === userType.USER && (
            <>
              <Col lg={8} md={8} sm={12} xs={24}>
                <InputPassword
                  disabled={!(type === 'create' || state.resetPassword)}
                  label={'Senha'}
                  placeholder="Insira uma senha temporária para o usuário"
                  tooltip={
                    'Caso não seja informada uma senha ao criar um usuario o sistema irá gerar uma automaticamente e enviará para o email cadastrado'
                  }
                  value={state.password}
                  onChange={(e) => dispatch({ password: e.target.value })}
                />
              </Col>
              {type === 'update' && (
                <Col lg={5} md={8} sm={12} xs={24}>
                  <Switch
                    label={'Resetar senha'}
                    title="Sim / Não"
                    checked={state.resetPassword}
                    checkedChildren="Sim"
                    unCheckedChildren="Não"
                    onChange={() =>
                      dispatch({ resetPassword: !state.resetPassword })
                    }
                  />
                </Col>
              )}
              <Col lg={3} md={8} sm={12} xs={24}>
                <Switch
                  label={'Status'}
                  title="Inativo / Ativo"
                  checked={state.status}
                  checkedChildren="Ativo"
                  unCheckedChildren="Inativo"
                  onChange={() => dispatch({ status: !state.status })}
                />
              </Col>
            </>
          )}
        </Row>
      </Col>

      {path === userType.USER && (
        <AccessType
          groupsSelecteds={state.accessType}
          setGroupsSelecteds={(accessType: string[]) =>
            dispatch({ accessType })
          }
        />
      )}
    </PanelCrud>
  );
};

export default CreateEdit;
