import { createGlobalStyle } from 'styled-components';
import 'antd/dist/antd.css';
import { systemColors } from 'utils/defaultValues';

export default createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }
    *:focus {
        outline: 0;
    }
    html, body, #root {
        height: 100%;
    }
    body {     
        
        -webkit-font-smoothing: antialiased;        
    }
    body, input, button {
        font: 14px 'Roboto', sans-serif;
    }

    a {
        text-decoration: none;
    }

    ul {
        list-style: none;
    }

    button {
        cursor: pointer;
    }
    .ant-layout-sider {
        background: #fff;
    }
    .ant-btn-primary {
        color: #fff;
        border-color: ${systemColors.BLUE};
        background: ${systemColors.BLUE};
    }
    
    .ant-spin-dot-item {
        background-color: ${systemColors.RED_DARK}
    }

    .ant-picker{
        width: 100%;
    }
    .ant-menu,
    .ant-menu-title-content,
    .ant-menu-item a {
        color: #999999;
        text-transform: uppercase;
    }
`;
