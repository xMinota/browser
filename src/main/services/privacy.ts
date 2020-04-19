import * as Electron from 'electron';
import loadPrivacyFeatures from '@dothq/electron-privacy';
import { DEFAULT_PREFERENCES } from '~/shared/models/default-preferences';
import { WindowsManager } from '../windows-manager';

export const runPrivacyFeatures = (ses: Electron.Session, conf: DEFAULT_PREFERENCES, windowsManager: WindowsManager) => {
    const { doNotTrack, block3rdPartyCookies, disableBatteryAPI, removeReferer, customReferer, maskSystemInformation, maskColorDepth } = conf.privacy;

    loadPrivacyFeatures(ses, {
        doNotTrack,
        disableBatteryAPI,
        removeReferer,
        customReferer,
        maskSystemInformation,
        maskColorDepth
    })
}