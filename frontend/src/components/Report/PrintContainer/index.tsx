import React, { ReactNode, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterOutlined } from '@ant-design/icons';

import { Container, PdfContainer } from './styles';
import Button from 'antd/lib/button/button';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  children: ReactNode;
  show: boolean;
  print?: boolean;
  title?: string;
  filename?: string;
}

const PrintContainer: React.FC<PropTypes> = ({
  children,
  show,
  print,
  title,
  filename
}) => {
  const componentRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    print && handlePrint();
  }, [print]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: filename
  });

  return (
    <Container>
      {show && (
        <Button
          style={{
            backgroundColor: systemColors.LIGHT_GREY,
            color: '#fff',
            padding: '0 8px'
          }}
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          block
        >
          {title}
        </Button>
      )}

      <PdfContainer>
        <div ref={componentRef}>{children}</div>
      </PdfContainer>
    </Container>
  );
};

export default PrintContainer;
