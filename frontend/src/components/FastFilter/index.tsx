import React, { useEffect, useMemo, useState } from 'react';
import { format, subMonths, addMonths, addYears, subYears } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { roules } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import { formatDateEn } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import { Col } from 'antd';
import { Select } from 'components/_inputs';
import { Container } from './styles';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { useQuery } from 'hooks/queryString';
import { Company } from 'pages/Company/interfaces';

interface PropTypes {
  state: any;
  setState: (state: any) => void;
  type?: 'MONTH' | 'YEAR';
}

const FastFilter: React.FC<PropTypes> = ({
  state,
  setState,
  type = 'MONTH'
}) => {
  const {
    companies,
    userAuthenticated,
    companySelected,
    setCompanySelected,
    userCompanyId
  } = useAppContext();
  const query = useQuery();
  const queryDate = query.get('_date')
    ? new Date(query.get('_date')!)
    : new Date();
  const [date, setDate] = useState(queryDate);
  const [groups, setGroups] = useState<string[]>([]);

  const formatByType = type === 'MONTH' ? "MMMM 'de' yyyy" : 'yyyy';
  const dateFormated = useMemo(
    () => format(date, formatByType, { locale: pt }),
    [date]
  );

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);

  useEffect(() => {
    const _date = formatDateEn(date.toISOString());
    setState({ ...state, date, _date });
  }, [date]);



  useEffect(() => {
    // const companyId = state.companyId ? state.companyId : userCompanyId;
    // const company = companies.find((c: Company) => c.id === companyId);
    // setCompanySelected(company);
  }, [state.companyId]);

  const handlePrevMonth = () => {
    if (type === 'MONTH') setDate(subMonths(date, 1));
    if (type === 'YEAR') setDate(subYears(date, 1));
  };

  const handleNextMonth = () => {
    if (type === 'MONTH') setDate(addMonths(date, 1));
    if (type === 'YEAR') setDate(addYears(date, 1));
  };

  return (
    <Container
      content={
        Boolean(checkRouleProfileAccess(groups, roules.administrator))
          ? 'space-between'
          : 'center'
      }
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={5} md={6} sm={12} xs={8}>
          <Select
            placeholder={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => setState({ ...state, companyId })}
          />
        </Col>
      </ShowByRoule>

      <div>
        <span onClick={handlePrevMonth}>
          <LeftOutlined />
        </span>
        <strong>{dateFormated}</strong>
        <span onClick={handleNextMonth}>
          <RightOutlined />
        </span>
      </div>
    </Container>
  );
};

export default FastFilter;
