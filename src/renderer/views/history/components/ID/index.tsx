import { observer } from 'mobx-react';
import { Container } from '../Categories/style';
import React from 'react';
import store from '../../store';
import { Item } from '../Item';
import { icons } from '~/renderer/views/app/constants';
import { Button } from '~/renderer/components/Button';
import { changeContent } from '../Categories';
import { goBack } from '../Header';
import { CDN_HOST } from '../../../../../constants';

const selector = Math.random().toString(36).substr(2, 5);

export const ID = observer(() => (
    <Container visible={store.currentContent == "id"} data-selector={selector}>
        <Item icon={`${CDN_HOST}/avatars/47fe3dc1-094e-474e-9c16-fc20dbf0e728.png`} text={"EnderDev"} secondText={`ender@ender.dev`} multiline iconSize={100} titleSize={22} secondTextSize={18} noInvert noHover iconStyle={{ opacity: 1, borderRadius: '50px' }} >
            <Button visible={store.currentContent == "id"} foreground={"black"} background={"white"}>Sign out</Button>
        </Item>
        <Item icon={icons.sync} text={"Last synced"} secondText={"Today at 4:28pm"} multiline noArrow noHover />
        <Item icon={icons.queued} text={"Items ready for syncing"} secondText={"12"} multiline noHover>
            <Button visible={store.currentContent == "id"} foreground={"black"} background={"white"}>Sync now</Button>
        </Item>
        <Item icon={icons.cake} text={"Days until account anniversary"} secondText={"42 days"} multiline noArrow noHover />
        <Item icon={icons.deleteForever} text={"Delete account"} titleColor={"#FF2E2E"} iconColor={"#FF2E2E"} onClick={() => changeContent("id.deleteAccount")} />
    </Container>
))

const selectorone = Math.random().toString(36).substr(2, 5);

export const IDDeleteAccount = observer(() => (
    <Container visible={store.currentContent == "id.deleteAccount"} data-selector={selectorone}>
        <Item icon={`${CDN_HOST}/avatars/47fe3dc1-094e-474e-9c16-fc20dbf0e728.png`} text={"EnderDev"} secondText={`ender@ender.dev`} multiline iconSize={100} titleSize={22} secondTextSize={18} noInvert noHover noArrow iconStyle={{ opacity: 1, borderRadius: '50px' }} />
        <Item icon={icons.warning} text={"Are you sure?"} secondText={"Once you delete your account, it cannot be restored"} noArrow multiline disabled style={{ opacity: 0.8 }} />
        <Item icon={""} text={"Cancel"} noArrow onClick={() => goBack()} />
        <Item icon={""} text={"Yes"} noArrow disabled={!store.deleteAccountReadiness} />
    </Container>
))