import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import './css/style.css';
//import './js/core';

const app = ReactDOMClient.createRoot(document.getElementById('root'));
app.render(<App />);