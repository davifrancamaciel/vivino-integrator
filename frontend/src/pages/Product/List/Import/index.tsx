import React, { ChangeEvent, useCallback, useState } from 'react';
import { Button, Modal, notification, Dropdown, Menu } from 'antd';
import {
  UploadOutlined,
  CloseSquareOutlined,
  DownOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

import api from 'services/api-aws-amplify';
import { apiRoutes, systemColors } from 'utils/defaultValues';
import { PropTypes } from './interfaces';
import { Product } from '../../interfaces';
import GridList from 'components/GridList';

import { Container } from './styles';
import { calculateSeconds } from 'utils';

const Import: React.FC<PropTypes> = ({ onImportComplete }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [fileName, setFileName] = useState('');

  const action = async () => {
    try {
      setLoading(true);
      const url = `${apiRoutes.products}/import`;
      const dateInitial = new Date();
      const result = await api.post(url, { items: items, fileName });
      calculateSeconds(dateInitial);
      if (result.success) {
        showHideModal();
        onImportComplete();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    try {
      let itemsList: Product[] = [];
      const file = !!e.target.files && e.target.files[0];
      if (file) {
        setFileName(file.name);
        if (file) {
          var reader = new FileReader();
          reader.onload = function (progressEvent: any) {
            debugger;
            var arraybuffer = progressEvent.target.result;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i)
              arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join('');

            /* Call XLSX */
            var workbook = XLSX.read(bstr, {
              type: 'binary'
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(
              XLSX.utils.sheet_to_json(worksheet, {
                raw: true
              })
            );
            // var fileContentArray = fileReaded.split(/\r\n/);

            // for (var line = 0; line < fileContentArray.length; line++) {
            //   if (line > 0) {
            //     const objLine = fileContentArray[line].split('|');
            //     const [id, name, briefing, objective] = objLine;
            //     const group: Product = {
            //       productId: id,
            //       active: true,
            //       productName: name,
            //       bottleSize: briefing,
            //       price: objective,
            //       quantityIsMinimum: true
            //     };
            //     if (
            //       group.productName &&
            //       group.productId &&
            //       group.productId?.length < 5
            //     )
            //       itemsList.push(group);
            //   }
            // }
            // setItems(itemsList);
            // if (!itemsList.length) {
            //   notification.warning({
            //     message:
            //       'Verifique se o arquivo selecionado contem linhas válidas'
            //   });
            //   return;
            // }
            // showHideModal();
          };

          reader.readAsText(file);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const showHideModal = () => {
    setVisible(!visible);
  };

  const handleBtnImportClick = () => {
    const btn: any = document.getElementById('inputUpload');
    if (btn) {
      btn.value = null;
      btn.click();
      setFileName('');
    }
  };

  const onDelete = (id?: string | number) => {
    if (id) {
      const newList = items.filter((i: Product) => i.productId !== id);
      !newList.length && setVisible(false);
      setItems(newList);
      notification.success({
        message: `Grupo código (${id}) removido com sucesso`
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<UploadOutlined />}
        onClick={handleBtnImportClick}
      >
        Carregar arquivo
      </Menu.Item>
      <Menu.Item key="2" icon={<DownloadOutlined />}>
        <a
          href={
            'https://nagra-static-files.s3.amazonaws.com/claro-message/grupos.txt'
          }
          target="_blank"
          rel="noopener noreferrer"
          download="grupos.txt"
        >
          Baixar modelo
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <input
        accept=".xls"
        type="file"
        id="inputUpload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Button
          style={{ background: systemColors.YELLOW, color: '#fff' }}
          loading={loading}
        >
          Importar arquivo txt <DownOutlined />
        </Button>
      </Dropdown>

      <Modal
        width={'90%'}
        title="Confirma importação abaixo?"
        visible={visible}
        onOk={action}
        onCancel={showHideModal}
        okText="Sim"
        cancelText="Cancelar"
        okButtonProps={{
          icon: <UploadOutlined />,
          loading,
          style: {
            border: 'hidden',
            color: '#fff',
            backgroundColor: systemColors.GREEN
          }
        }}
        cancelButtonProps={{ icon: <CloseSquareOutlined /> }}
      >
        <Container>
          <GridList
            scroll={{ x: 600 }}
            columns={[
              { title: 'Código', dataIndex: 'id' },
              { title: 'Nome', dataIndex: 'name' },
              { title: 'Briefing', dataIndex: 'briefing' },
              { title: 'Objetivo', dataIndex: 'objective' }
            ]}
            dataSource={items}
            onDelete={onDelete}
            propTexObjOndelete={'name'}
            totalRecords={items.length}
            pageSize={items.length}
            hidePagination={true}
            loading={loading}
            routes={{
              routeCreate: ``,
              routeUpdate: ``,
              routeDelete: `CUSTOM_DELETE`
            }}
          />
        </Container>
      </Modal>
    </div>
  );
};

export default Import;
