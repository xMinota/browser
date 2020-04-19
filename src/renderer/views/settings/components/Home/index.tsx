import { observer } from 'mobx-react';
import { Container } from '../Categories/style';
import React from 'react';
import store from '../../store';
import { Item } from '../Item';
import { icons } from '~/renderer/views/app/constants';
import { changeContent } from '../Categories';

const selector = Math.random().toString(36).substr(2, 5);

export const getPrettyTheme = () => {
    const theme = (window as any).settings.appearance.theme;

    if(theme == "light") {
        return "Light"
    } else if(theme == "dark") {
        return "Dark"
    } else if(theme == "oled") {
        return "OLED (beta)"
    } else {
        return "Fallback";
    }
}

export const Home = observer(() => (
    <Container visible={store.currentContent == "home"} data-selector={selector}>
        <Item icon={icons.userSquare} text={"ID"} onClick={() => changeContent("id")} />
        <Item icon={icons.shield} text={"Privacy"} secondText={`Blocked ${parseInt((window as any).blockedAds).toLocaleString()} ads in this session`} multiline={parseInt((window as any).blockedAds) !== 0}  onClick={() => changeContent("privacy")} />
        <Item icon={icons.palette} text={"Appearance"} secondText={`Using ${getPrettyTheme()} theme`} multiline onClick={() => changeContent("appearance")} />
        <Item icon={icons.search} text={"Search"} onClick={() => changeContent("search")} />
        <Item icon={icons.key} text={"Keychains"} onClick={() => changeContent("keychains")} />
        <Item icon={icons.translate} text={"Languages"} onClick={() => changeContent("languages")} />
        <Item icon={icons.download} text={"Downloads"} onClick={() => changeContent("downloads")} />
        <Item icon={icons.ring} text={"About Dot Browser"} secondText={`Version ${(window as any).version}`} multiline onClick={() => changeContent("about")} />
    </Container>
))