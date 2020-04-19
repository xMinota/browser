import * as React from 'react';

import { render } from 'react-dom';;
import { fonts } from '../app/constants/fonts';
import { App } from './app';
import { createMount } from '~/shared/utils/webui';
import store from './store';

const styleElement = document.createElement('style');

styleElement.textContent = `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(${fonts.robotoRegular}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(${fonts.robotoMedium}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: url(${fonts.robotoLight}) format('woff2');
}

${store.conf.appearance.animations == false ? `
* {
  transition: none !important;
  animation: none !important;
}
` : ''}
`;

document.head.appendChild(styleElement);

createMount(document);

render(<App />, document.getElementById('app'));
