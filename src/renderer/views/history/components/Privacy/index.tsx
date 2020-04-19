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

const onBlockAdsClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.adblocker = true
	} else {
        (window as any).settings.privacy.adblocker = false
        
    }
    
    window.postMessage(
        {
          type: 'adblock-service-status',
          data: (window as any).settings.privacy.adblocker
        },
        '*',
    );

	store.saveSettings((window as any).settings)
}

const onDNTClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.doNotTrack = true
	} else {
        (window as any).settings.privacy.doNotTrack = false
        
    }

	store.saveSettings((window as any).settings)
}

const onCookieClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.block3rdPartyCookies = true
	} else {
        (window as any).settings.privacy.block3rdPartyCookies = false
        
    }

	store.saveSettings((window as any).settings)
}

const onReferrerClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.removeReferer = true
	} else {
        (window as any).settings.privacy.removeReferer = false
        
    }

	store.saveSettings((window as any).settings)
}

export const Privacy = observer(() => (
    <Container visible={store.currentContent == "privacy"} data-selector={selector}>
        <Item icon={icons.shield} text={"Block advertisments and trackers"} secondText={store.conf.privacy.adblocker ? "Enabled" : "Disabled"} multiline noHover>
			<Switch checked={store.conf.privacy.adblocker} click={onBlockAdsClick} />
		</Item>
        <Item icon={icons.noTracking} text={"Do Not Track"} secondText={"Force sites to not use trackers"} multiline noHover>
            <Switch checked={store.conf.privacy.doNotTrack} click={onDNTClick} />
		</Item>
        <Item icon={icons.cookie} text={"Block 3rd Party Cookies"} secondText={"Block cookies coming from 3rd parties"} multiline noHover>
            <Switch checked={store.conf.privacy.block3rdPartyCookies} click={onCookieClick} />
		</Item>
        <Item icon={icons.pagePrevious} text={"Remove Referrer header"} secondText={"Stop sites from reading your previously visited page"} multiline noHover>
            <Button visible={store.conf.privacy.removeReferer} onClick={() => changeContent('privacy.referrerOptions')} foreground={"black"} background={"white"} style={{ marginRight: '28px' }}>Options</Button>
            <Switch checked={store.conf.privacy.removeReferer} click={onReferrerClick} />
		</Item>
        <Item icon={""} text={"More options"} onClick={() => changeContent('privacy.moreOptions')} />
    </Container>
))

const selectorone = Math.random().toString(36).substr(2, 5);

const onBatteryClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.disableBatteryAPI = true
	} else {
        (window as any).settings.privacy.disableBatteryAPI = false
        
    }

	store.saveSettings((window as any).settings)
}

const onSysInfoClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.maskSystemInformation = true
	} else {
        (window as any).settings.privacy.maskSystemInformation = false
        
    }

	store.saveSettings((window as any).settings)
}

const onColorDepthClick = (toggled) => {
	if(toggled) {
        (window as any).settings.privacy.maskColorDepth = true
	} else {
        (window as any).settings.privacy.maskColorDepth = false
        
    }

	store.saveSettings((window as any).settings)
}

export const PrivacyMoreOptions = observer(() => (
    <Container visible={store.currentContent == "privacy.moreOptions"} data-selector={selectorone}>
        <Item icon={icons.battery} text={"Remove Battery APIs"} secondText={"Sites could read your battery level and profile you based on it"} multiline noHover>
            <Switch checked={store.conf.privacy.disableBatteryAPI} click={onBatteryClick} />
		</Item>
        <Item icon={icons.deviceInformation} text={"Mask System Information"} secondText={"Web Workers can read the amount of processors on your device"} multiline noHover>
            <Switch checked={store.conf.privacy.maskSystemInformation} click={onSysInfoClick} />
		</Item>
        <Item icon={icons.invert} text={"Mask Color Depth"} secondText={store.conf.privacy.maskColorDepth ? "Enabled" : "Disabled"} multiline noHover>
            <Switch checked={store.conf.privacy.maskColorDepth} click={onColorDepthClick} />
		</Item>
    </Container>
))

const selectortwo = Math.random().toString(36).substr(2, 5);

const referrerRef = React.createRef<HTMLInputElement>();

const saveReferrerSettings = () => {
    (window as any).settings.privacy.customReferer = referrerRef.current.value;

    store.saveSettings((window as any).settings)
    
    goBack()
}

export const PrivacyReferrerOptions = observer(() => (
    <Container visible={store.currentContent == "privacy.referrerOptions"} data-selector={selectortwo}>
        <Item icon={""} text={"Custom Referrer Value"} secondText={"Override default Referrer value"} multiline noHover>
            <Inputfield 
                inputType={"text"} 
                backgroundColor={store.theme["webui-settings-search-background"]} 
                color={store.theme["general-title"]} 
                indicatorColor={"transparent"} 
                value={store.conf.privacy.customReferer}
                placeholder={"Referrer removed by Dot"}
                inputRef={referrerRef}
            />
		</Item>
        <Item icon={""} text={""} noHover>
            <Button visible={store.currentContent == "privacy.referrerOptions"} onClick={saveReferrerSettings} foreground={"black"} background={"white"} style={{ marginRight: 0 }}>Save</Button>
		</Item>
    </Container>
))