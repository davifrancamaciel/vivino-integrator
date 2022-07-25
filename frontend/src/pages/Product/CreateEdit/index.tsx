import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
import { Input, Switch, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.products}/${id}`);
      dispatch({ ...resp.data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.productName || !state.price || !state.bottleSize) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.products, state);
      api.get(`${apiRoutes.products}/run-update-xml`);

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
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Código do produto'}
          type={'number'}
          disabled={type === 'update'}
          placeholder="1"
          value={state.id}
          onChange={(e) => dispatch({ id: e.target.value })}
        />
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Input
          label={'Nome do produto'}
          required={true}
          placeholder="Famille Perrin Réserve Côtes-du-Rhône 2019 Rouge"
          value={state.productName}
          onChange={(e) => dispatch({ productName: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Preço'}
          required={true}
          type={'number'}
          placeholder="15.00"
          value={state.price}
          onChange={(e) => dispatch({ price: e.target.value })}
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          required={true}
          label={'Tamanho da garrafa'}
          placeholder="750 ml"
          value={state.bottleSize}
          onChange={(e) => dispatch({ bottleSize: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Quantidade de garrafas'}
          type={'number'}
          placeholder="1"
          value={state.bottleQuantity}
          onChange={(e) => dispatch({ bottleQuantity: e.target.value })}
        />
      </Col>
      <Col lg={6} md={8} sm={24} xs={24}>
        <Switch
          label={'Quantidade é mínima'}
          title="Não / Sim"
          checked={state.quantityIsMinimum}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({ quantityIsMinimum: !state.quantityIsMinimum })
          }
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Contagem de inventário'}
          type={'number'}
          placeholder="1"
          value={state.inventoryCount}
          onChange={(e) => dispatch({ inventoryCount: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Produtor'}
          maxLength={100}
          placeholder="Famille Perrin"
          value={state.producer}
          onChange={(e) => dispatch({ producer: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Nome do vinho'}
          maxLength={100}
          placeholder="Réserve"
          value={state.wineName}
          onChange={(e) => dispatch({ wineName: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Denominação'}
          maxLength={100}
          placeholder="Côtes-du-Rhône"
          value={state.appellation}
          onChange={(e) => dispatch({ appellation: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Vintage'}
          type={'number'}
          placeholder="2019"
          value={state.vintage}
          onChange={(e) => dispatch({ vintage: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'País'}
          maxLength={100}
          placeholder="France"
          value={state.country}
          onChange={(e) => dispatch({ country: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Cor'}
          maxLength={100}
          placeholder="Rouge"
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
        <Input
          label={'Álcool'}
          maxLength={100}
          placeholder="13.4%"
          value={state.alcohol}
          onChange={(e) => dispatch({ alcohol: e.target.value })}
        />
      </Col>
      <Col lg={12} md={24} sm={24} xs={24}>
        <Input
          label={'Link do vinho no seu site'}
          placeholder="http://www.wayback-wines.com/california/wine-12345.html"
          value={state.link}
          onChange={(e) => dispatch({ link: e.target.value })}
        />
      </Col>
      <Col lg={12} md={24} sm={24} xs={24}>
        <Input
          label={'Link da imagem'}
          placeholder="http://www.wayback-wines.com/wp-content/uploads/img/2535550.jpg"
          value={state.image}
          onChange={(e) => dispatch({ image: e.target.value })}
        />
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          placeholder="This is a great wine from Famille Perrin with good value."
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
        />
      </Col>

      <Col lg={12} md={12} sm={24} xs={24}>
        <Input
          label={'Endereço do produtor'}
          maxLength={100}
          placeholder="3333 Route de Jonquières, 84100 Orange, France"
          value={state.producerAddress}
          onChange={(e) => dispatch({ producerAddress: e.target.value })}
        />
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Input
          label={'Endereço do importador'}
          maxLength={100}
          placeholder="Moet Hennessy Deutschland GmbH, 80335 München, Deutschland"
          value={state.importerAddress}
          onChange={(e) => dispatch({ importerAddress: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Varietal'}
          maxLength={100}
          placeholder="40% Grenache, 40% Mourvèdre, 20% Syrah"
          value={state.varietal}
          onChange={(e) => dispatch({ varietal: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Envelhecimento'}
          maxLength={100}
          placeholder="12 months in oak"
          value={state.ageing}
          onChange={(e) => dispatch({ ageing: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Fecho'}
          maxLength={100}
          placeholder="natural cork"
          value={state.closure}
          onChange={(e) => dispatch({ closure: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Winemaker'}
          maxLength={100}
          placeholder="Dorne Waters"
          value={state.winemaker}
          onChange={(e) => dispatch({ winemaker: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Tamanho da produção'}
          maxLength={100}
          type={'number'}
          placeholder="14000"
          value={state.productionSize}
          onChange={(e) => dispatch({ productionSize: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Açúcar residual'}
          type={'number'}
          maxLength={100}
          placeholder="20.1"
          value={state.residualSugar}
          onChange={(e) => dispatch({ residualSugar: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'Acidez'}
          maxLength={100}
          type={'number'}
          placeholder="5.5"
          value={state.acidity}
          onChange={(e) => dispatch({ acidity: e.target.value })}
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Input
          label={'PH'}
          maxLength={100}
          type={'number'}
          placeholder="3.5"
          value={state.ph}
          onChange={(e) => dispatch({ ph: e.target.value })}
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Switch
          label={'Contém alérgenos do leite'}
          title="Não / Sim"
          checked={state.containsMilkAllergens}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({ containsMilkAllergens: !state.containsMilkAllergens })
          }
        />
      </Col>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Switch
          label={'Contém alérgenos de ovo'}
          title="Não / Sim"
          checked={state.containsEggAllergens}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({ containsEggAllergens: !state.containsEggAllergens })
          }
        />
      </Col>

      <Col lg={6} md={12} sm={24} xs={24}>
        <Switch
          label={'Não alcoólico'}
          title="Não / Sim"
          checked={state.nonAlcoholic}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ nonAlcoholic: !state.nonAlcoholic })}
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
    </PanelCrud>
  );
};

export default CreateEdit;
