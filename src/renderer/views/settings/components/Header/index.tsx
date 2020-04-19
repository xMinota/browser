import * as React from 'react';

import { observer } from 'mobx-react';
import { StyledHeader, Container, Title, TopLayer, BottomLayer, Search, SearchIcon, Input } from './style';
import { Icon } from '../../app/style';
import { icons } from '~/renderer/views/app/constants';
import { changeContent } from '../Categories';
import store from '../../store';

export const goBack = () => {
    store.deleteAccountReadiness = false;

    if(store.currentContent == "home") {
        store.currentContent == "home"
    } else {
        store.previousContents.pop()
        store.currentContent = store.previousContents[store.previousContents.length-1]
    }
}

export const Header = observer(() => (
    <StyledHeader>
        <Container>
            <TopLayer>
                <Icon icon={store.currentContent == "home" ? icons.settings : icons.arrowBack} size={38} centered flexy header onClick={() => goBack()} />
                <Title>Settings</Title>
            </TopLayer>
            <BottomLayer>
                <Search>
                    <SearchIcon icon={icons.search} />
                    <Input placeholder={"Search for a setting"} />
                </Search>
            </BottomLayer>
        </Container>
    </StyledHeader>
))