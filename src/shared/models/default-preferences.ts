export interface DEFAULT_PREFERENCES {
    appearance: {
        theme: "auto" | "light" | "dark" | "oled",
        showHomeButton: boolean
    },
    search: {
        provider: "duckduckgo" | "google" | "bing" | "yahoo" | "ecosia"
    },
    privacy: {
        adblocker: boolean,
        disableBatteryAPI: boolean,
        block3rdPartyCookies: boolean,
        doNotTrack: boolean,
        maskSystemInformation: boolean,
        maskColorDepth: boolean,
        removeReferer: boolean,
        customReferer: string,
        hideIPAddress: boolean
    }
}

export const DEFAULT_PREFERENCES_OBJECT: DEFAULT_PREFERENCES = {
    appearance: {
        theme: "auto",
        showHomeButton: false
    },
    search: {
        provider: "duckduckgo"
    },
    privacy: {
        adblocker: true,
        disableBatteryAPI: true,
        block3rdPartyCookies: false,
        doNotTrack: true,
        maskSystemInformation: true,
        maskColorDepth: true,
        removeReferer: true,
        customReferer: "Referrer removed by Dot",
        hideIPAddress: true
    }
}