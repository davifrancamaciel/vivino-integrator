import React, { useEffect, useState } from 'react';

import { useAppContext } from 'hooks/contextLib';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';

interface PropTypes {
  roule: string;
}
const ShowByRoule: React.FC<PropTypes> = ({ roule, children }) => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);
  return <>{checkRouleProfileAccess(groups, roule) && children}</>;
};

export default ShowByRoule;
