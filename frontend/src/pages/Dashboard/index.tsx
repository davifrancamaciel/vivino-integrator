import React from 'react';

import Cards from './Cards';
import Wines from './Wines';
import ShowByRoule from 'components/ShowByRoule';
import { roules } from 'utils/defaultValues';
import UrlFeed from './UrlFeed';

const Dashboard: React.FC = () => (
  <div>
    <Cards />
    <ShowByRoule roule={roules.wines}>
      <UrlFeed />
      <Wines />
    </ShowByRoule>
  </div>
);

export default Dashboard;
