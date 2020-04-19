import * as React from 'react';
import { StyledApp, Title, Subtitle, Line, Container } from './style';
import store from '../store';
import { observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import { Item } from '../components/Item';
import { icons } from '../../app/constants';
import { ipcRenderer } from 'electron';

const showCertificate = () => {
  ipcRenderer.send(`show-certificate-${store.id}`)
}

const Items = observer(() => (
  <Container>
    <Item icon={icons.starFilled} text={"Certificate"} onClick={() => showCertificate()} />
  </Container>  
))

const App = observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <StyledApp visible={store.visible} height={store.height} width={store.width}>

        <Title style={{ fontSize: store.type == "webpage" ? "16px" : "", color: store.type == "webpage" ? "#15FF73" : "" }}>{store.title}</Title>

        {store.type == "webpage" && <Subtitle dangerouslySetInnerHTML={{ __html: store.description }} />}

        {store.type == "webpage" && <Line />}
        
        {store.type == "webpage" && <Items />}
      </StyledApp>
    </ThemeProvider>
  )
})

export default App;