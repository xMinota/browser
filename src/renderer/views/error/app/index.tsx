import * as React from 'react';
import { Title, Main, Icon, Description, Strong, Style, Code } from '../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import store from '../store';

const GlobalStyle = createGlobalStyle`${Style}`;

const Error = () => (
  <ThemeProvider theme={store.theme}>
    <Main>
      <GlobalStyle />
      <Icon style={{ backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAENJREFUeF7tzbEJACEQRNGBLeAasBCza2lLEGx0CxFGG9hBMDDxRy/72O9FMnIFapGylsu1fgoBdkXfUHLrQgdfrlJN1BdYBjQQm3UAAAAASUVORK5CYII=)' }} />
      <Title>Something went wrong</Title>
      <Description>The web page at <Strong>chrome://network-error/0</Strong> might be temporarily down or it may have moved permanently to a new web address.</Description>
      <Code>ERR_FAILED_LOAD</Code>
    </Main>
  </ThemeProvider>
)

export default Error;