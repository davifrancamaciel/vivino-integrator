import React, { ReactNode, useEffect, useState } from 'react';
import logo from 'assets/logo.jpg';
import logo_flower from 'assets/logo_flower.jpg';
import { Container } from './styles';

interface PropTypes {
  title: string;
  children: ReactNode;
  headerList?: string[];
  isFlower?: boolean;
}

const TableReport: React.FC<PropTypes> = ({
  title,
  children,
  headerList,
  isFlower
}) => {
  const [headerListItens, setHeaderListItens] = useState<string[]>([]);
  useEffect(() => {
    if (headerList) {
      setHeaderListItens(headerList);
    }
  }, [headerList]);
  return (
    <Container>
      <div className="page">
        <table style={{ fontSize: '12px' }} cellSpacing="0">
          <thead>
            <tr>
              <th
                colSpan={headerListItens?.length ? headerListItens.length : 5}
              >
                <header>
                  <img alt={''} src={isFlower ? logo_flower : logo} />
                  <h2>{title}</h2>
                </header>
              </th>
            </tr>

            <tr>
              {headerListItens.map(
                (titleHeader, i) =>
                  titleHeader && <th key={i}>{titleHeader}</th>
              )}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Container>
  );
};

export default TableReport;
