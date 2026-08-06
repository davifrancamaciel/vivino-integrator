import { appRoutes } from 'utils/defaultValues';
import ActionDelete from 'components/GridList/actionDelete';
import React, { useState } from 'react';
import { Expense } from 'pages/Expense/interfaces';
import api from 'services/api-aws-amplify';

interface PropTypes {
  selectedItems?: Expense[];
  onComplete?: (
    pageNumber: any,
    paymentDateStart: any,
    paymentDateEnd: any,
    field: any,
    order: any
  ) => void;
  state: any;
}
const Delete: React.FC<PropTypes> = (props) => {
  const [loading, setLoading] = useState(false);

  const ids = props.selectedItems!.map((x: Expense) => x.id!);

  const deleteConfirm = async () => {
    try {
      setLoading(true);
      const resp = await api.post(`${appRoutes.expenses}/delete`, { ids });
      setLoading(false);

      if (resp.success) {
        props.onComplete &&
          props.onComplete(
            props?.state?.pageNumber,
            props?.state?.paymentDateStart,
            props?.state?.paymentDateEnd,
            props?.state?.field,
            props?.state?.order
          );
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <ActionDelete
      propTexObjOndelete={'nameInfoDel'}
      id={0}
      item={{
        nameInfoDel: props.selectedItems
          ?.map((item: Expense) => item.title)
          .join(', ')
      }}
      router={'CUSTOM_DELETE'}
      text="Apagar itens selecionados"
      onDelete={deleteConfirm}
    />
  );
};

export default Delete;
