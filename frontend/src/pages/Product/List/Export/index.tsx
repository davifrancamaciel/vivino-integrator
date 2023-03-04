import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';

import ExportCSV from 'components/ExportCSV';

import { formatDateHour } from 'utils/formatDate';
import api from 'services/api-aws-amplify';
import { Filter, Product } from '../../interfaces';

import { Button } from 'antd';
import { apiRoutes, systemColors } from 'utils/defaultValues';

const Export: React.FC<Filter> = (props) => {
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState<Array<any>>([]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Product[] = []
  ) => {
    try {
      setLoading(true);

      const resp = await api.get(apiRoutes.products, {
        ...props,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;

      itemsArray = [...itemsArray, ...rows];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        const newData = itemsArray.map((item: Product) => ({
          ...item,
          active: item.active ? 'SIM' : 'NÃO',
          containsMilkAllergens: item.containsMilkAllergens ? 'SIM' : 'NÃO',
          containsEggAllergens: item.containsEggAllergens ? 'SIM' : 'NÃO',
          nonAlcoholic: item.nonAlcoholic ? 'SIM' : 'NÃO',
          quantityIsMinimum: item.quantityIsMinimum ? 'SIM' : 'NÃO',
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt)
        }));
        setFormattedData(newData);
        setLoading(false);
        const btn = document.getElementById('ghost-button');
        if (btn) {
          btn.click();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <ExportCSV
        id="export-csv"
        data={formattedData}
        documentTitle={`relatorio-${new Date().getTime()}.csv`}
        headers={[
          { label: 'Código do produto', key: 'id' },
          { label: 'Nome do produto', key: 'productName' },
          { label: 'Preço', key: 'price' },
          { label: 'Ativo', key: 'active' },
          { label: 'Data de cadastro', key: 'createdAt' },
          { label: 'Data de alteração', key: 'updatedAt' },
          { label: 'Tamanho da garrafa', key: 'bottleSize' },
          { label: 'Quantidade de garrafas', key: 'bottleQuantity' },
          { label: 'Quantidade é mínima', key: 'quantityIsMinimum' },
          { label: 'Contagem de inventário', key: 'inventoryCount' },
          { label: 'Produtor', key: 'producer' },
          { label: 'Nome do vinho', key: 'wineName' },
          { label: 'Denominação', key: 'appellation' },
          { label: 'Vintage', key: 'vintage' },
          { label: 'País', key: 'country' },
          { label: 'Cor', key: 'color' },
          { label: 'Código de barras', key: 'ean' },
          { label: 'Álcool', key: 'alcohol' },
          { label: 'Endereço do produtor', key: 'producerAddress' },
          { label: 'Endereço do importador', key: 'importerAddress' },
          { label: 'Varietal', key: 'varietal' },
          { label: 'Envelhecimento', key: 'ageing' },
          { label: 'Fecho', key: 'closure' },
          { label: 'Winemaker', key: 'winemaker' },
          { label: 'Tamanho da produção', key: 'productionSize' },
          { label: 'Açúcar residual', key: 'residualSugar' },
          { label: 'Acidez', key: 'acidity' },
          { label: 'PH', key: 'ph' },
          { label: 'Contém alérgenos do leite', key: 'containsMilkAllergens' },
          { label: 'Contém alérgenos de ovo', key: 'containsEggAllergens' },
          { label: 'Não alcoólico', key: 'nonAlcoholic' },
          { label: 'Link do vinho no seu site', key: 'link' },
          { label: 'Link da imagem', key: 'image' },
          { label: 'Descrição', key: 'description' }
        ]}
      >
        <Button
          id="ghost-button"
          style={{ display: 'none' }}
          loading={loading}
        ></Button>
      </ExportCSV>

      <Button
        type="link"
        icon={<DownloadOutlined />}
        onClick={() => actionFilter()}
        loading={loading}
        style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
      >
        Exportar para CSV
      </Button>
    </>
  );
};

export default Export;
