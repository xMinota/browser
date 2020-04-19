import { observer } from 'mobx-react';
import { StyledSpotlight, StyledBubbleContainer, Copyright, Bubble } from './style';
import React from 'react';
import { icons, WEBUI_BASE } from '~/renderer/views/app/constants';
import { remote, ipcRenderer } from 'electron';
import store from '../../store';
import { callViewMethod } from '~/shared/utils/view';

const openWebUI = (ui) => {
    const url = `${WEBUI_BASE}${ui}`

    if(store.details.url.length == 0 || store.details.url.startsWith(WEBUI_BASE)) {
        callViewMethod(store.details.tabId, 'webContents.loadURL', url);
    } else {
        ipcRenderer.send('view-create', { url, active: true })
    }

    store.hide()
}

export const Spotlight = observer(() => (
    <StyledSpotlight>
        <StyledBubbleContainer>
            <Bubble icon={icons.history} onClick={() => openWebUI("history")} />
            <Bubble icon={icons.bookmarks} onClick={() => openWebUI("bookmarks")} />
            <Bubble icon={icons.download} onClick={() => openWebUI("downloads")} />
            <Bubble icon={icons.settings} hasBadge={process.env.__DOT_UPDATE_AVAILABLE == "true" ? true : false} onClick={() => openWebUI("settings")} />
            <Bubble icon={icons.extensions} style={{ marginRight: 0 }} onClick={() => openWebUI("extensions")} />
        </StyledBubbleContainer>
    </StyledSpotlight>
))