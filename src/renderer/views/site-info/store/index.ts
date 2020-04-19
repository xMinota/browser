import { observable, computed } from "mobx";
import { DialogStore } from '~/models/dialog-store';
import { ipcRenderer } from 'electron';
import { IContent } from '~/interfaces/site-info';
import { getHostname } from '~/shared/utils/url';

class Store extends DialogStore {
    @observable
    public url = '';

    @observable
    public type = '';

    @observable
    public connectionType = '';

    @observable
    public height = 0;

    @observable
    public width = 0;
    
    public constructor() {
        super({ hideOnBlur: false });

        ipcRenderer.on('content', (e, content: IContent) => {
            for (const [key, value] of Object.entries(content)) {
                this[key] = value;
            }
        })
    }

    public async onVisibilityChange(visible: boolean) {
        this.visible = visible;
    }
    
    @computed
    public get title() {
        if(this.type == "webui") return "You’re looking at a secure Dot Browser page."
        if(this.type == "file") return "You’re looking at a local or shared file."

        if(this.type == "webpage" && this.connectionType == "secure") return "Connection is secure"
        if(this.type == "webpage" && this.connectionType == "insecure") return "Your connection is not secure" 
    }

    @computed
    public get description() {
        let returnValue = "";

        if(this.type == "webui") returnValue = "Dot pages are secure pages which are accessible offline and include your history, bookmarks and history."
        if(this.type == "file") returnValue = ""

        if(this.type == "webpage" && this.connectionType == "secure") returnValue = `All information sent to <b>${getHostname(this.url)}</b> like passwords and sensitive information is private.`
        if(this.type == "webpage" && this.connectionType == "insecure") returnValue = "You should avoid entering personal information on this site, like your credit card details or passwords." 

        return returnValue;
    }

}

export default new Store()