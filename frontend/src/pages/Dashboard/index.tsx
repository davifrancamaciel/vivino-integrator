import React from 'react';

import Cards from './Cards';
import Wines from './Wines';
import ShowByRoule from 'components/ShowByRoule';
import { roules } from 'utils/defaultValues';
import UrlFeed from './UrlFeed';
import LineGraph from './LineGraph';

const Dashboard: React.FC = () => (
  <div>
    <Cards />
    <ShowByRoule roule={roules.sales}>
      <LineGraph label="Produtos" type="products" />
    </ShowByRoule>
    <ShowByRoule roule={roules.wines}>
      <UrlFeed />
      <LineGraph label="Vinhos" type="wines" />
      <Wines />
    </ShowByRoule>
  </div>
);

export default Dashboard;
