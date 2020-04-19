import * as React from 'react';
import { observer } from 'mobx-react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { StyledApp, Style } from './style';
import store from '../store';
import { Header, goBack } from '../components/Header';
import { Categories } from '../components/Categories';

const GlobalStyle = createGlobalStyle`${Style}`;

window.addEventListener('keyup', (e) => {
  if(e.which == 27 || e.which == 37 && document.activeElement.tagName !== "INPUT") {
    goBack()
  }
})

export const App = observer(() => (
  <ThemeProvider theme={store.theme}>
      <StyledApp>
          <GlobalStyle />
          <Header />
          <Categories />
      </StyledApp>
  </ThemeProvider>
))