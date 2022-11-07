const Td = ({ title, value, children, styleTd, colSpan }: any) => (
  <td
    colSpan={colSpan ? colSpan : '1'}
    style={{
      border: '#eee solid 1px',
      fontSize: '12px',
      verticalAlign: 'center',
      padding: '4px 12px',
      ...styleTd
    }}
  >
    {children ? children : <TdItem title={title} value={value} />}
  </td>
);

const TdItem = ({ title, value }: any) => (
  <div>
    <strong>{title}</strong>
    <span style={{ marginLeft: '5px' }}>{value}</span>
  </div>
);

export default Td;
