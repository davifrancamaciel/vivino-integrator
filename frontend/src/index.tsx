import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Amplify } from 'aws-amplify';

import configAmplify from './utils/config-amplify';

Amplify.configure(configAmplify);

ReactDOM.render(<App />, document.getElementById('root'));
