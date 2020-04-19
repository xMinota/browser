import * as React from 'react';

import { observer } from 'mobx-react';
import { StyledCategories } from './style';
import store, { SettingsSection } from '../../store';
import { Home } from '../Home';
import { ID, IDDeleteAccount } from '../ID';
import { Privacy, PrivacyMoreOptions, PrivacyReferrerOptions } from '../Privacy';
import { Appearance } from '../Appearance';
import { About } from '../About';

export const changeContent = (content: SettingsSection) => {
    store.deleteAccountReadiness = false;

    store.previousContents.push(content);
    store.currentContent = content;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

export const Categories = observer(() => {
    if(store.currentContent == "id.deleteAccount") {
        setTimeout(() => {
            store.deleteAccountReadiness = true;
        }, 3000);
    }

    return (
        <StyledCategories>
            <Home />
            <ID />
            <IDDeleteAccount />
            <Privacy />
            <PrivacyMoreOptions />
            <PrivacyReferrerOptions />
            <Appearance />
            <About />
        </StyledCategories>
    )
})