import styled from 'styled-components';

export const Container = styled.div`
  min-width: 800px;

  .page {
    font-size: 14px;
    background-color: #fff;
    padding: 0px 20px;
    color: #333;
    max-width: 800px;
    margin: auto;
    display: flex;
    justify-content: center;
    table {
      width: 100%;
      max-width: 1000px;
      header {
        color: #968d8d;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: #eee solid 1px;
        padding-bottom: 10px;
        img {
          max-width: 150px;
          max-height: 90px;
        }
        h2 {
          font-size: 18px;
          font-weight: 100;
        }
      }
      thead th {
        border: #eee solid 1px;
        padding: 5px 5px;
        text-align: initial;
      }
      /* thead tr:first-child th {
        border: none !important;
        padding: 25px 0px;
      } */
      tbody tr {
        transition: background-color 0.2s;
      }
      tbody tr:hover {
        background-color: #eee;
      }
      td {
        padding: 5px;
        border-bottom: #eee solid 1px;
      }
      td:last-child {
        border-right: #eee solid 1px;
      }
      td:first-child {
        border-left: #eee solid 1px;
      }
    }
    @media all {
      .page-break {
        display: none;
      }
    }

    @media print {
      html,
      body {
        height: initial !important;
        overflow: initial !important;
        -webkit-print-color-adjust: exact;
      }
    }

    @media print {
      .page-break {
        display: block;
        page-break-before: auto;
      }
    }

    @page {
      size: auto;
      margin: 10mm 0mm;
    }
  }
`;
