import React, { ReactNode, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterOutlined } from '@ant-design/icons';

import { Container, PdfContainer } from './styles';

interface PropTypes {
  children: ReactNode;
  show: boolean;
  print?: boolean;
}

const PrintContainer: React.FC<PropTypes> = ({ children, show, print }) => {
  useEffect(() => {
    print && handlePrint();
  }, [print]);
  const componentRef = useRef<HTMLHeadingElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Ary Delicatessen'
  });

  return (
    <Container>
      <header>
        <span></span>
        {show && (
          <button onClick={handlePrint}>
            <PrinterOutlined />
          </button>
        )}
      </header>

      <PdfContainer>
        <div ref={componentRef}>{children}</div>
      </PdfContainer>
    </Container>
  );
};

export default PrintContainer;
