import { observer } from 'mobx-react';
import { Container } from '../Categories/style';
import React from 'react';
import store from '../../store';
import { Item } from '../Item';
import { icons } from '~/renderer/views/app/constants';
import { Switch } from '../Switch';
import { runAdblockService } from '~/main/services';
import { changeContent } from '../Categories';
import { Button } from '~/renderer/components/Button';
import { Inputfield } from '~/renderer/components/Input';
import { goBack } from '../Header';

const selector = Math.random().toString(36).substr(2, 5);

export const About = observer(() => (
    <Container visible={store.currentContent == "about"} data-selector={selector}>
        <Item icon={icons.logo} text={"Dot Browser"} secondText={`v${(window as any).version}`} multiline iconSize={100} titleSize={22} secondTextSize={18} noInvert noHover iconStyle={{ opacity: 1, borderRadius: '50px', backgroundColor: '#181818', backgroundImage: 'none', border: '14px solid white' }} >
            <Button visible={store.currentContent == "id"} foreground={"black"} background={"white"}>Sign out</Button>
        </Item>
    </Container>
))