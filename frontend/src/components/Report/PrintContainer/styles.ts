import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 14px;
    color: var(--text-color);
    font-weight: bold;

    button {
      background: transparent;
      border: none;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      font-weight: bold;
      color: var(--text-color);
      > span {
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
          color: '#6c6c80';
        }
      }
      > svg {
        color: var(--secondary-color);
        margin-right: 16px;
      }
    }
  }
`;

export const PdfContainer = styled.div`
  width: 100%;
  display: none;
`;
