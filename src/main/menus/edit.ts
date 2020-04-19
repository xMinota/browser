import Electron, { Menu, app, clipboard } from 'electron'
import { specialKey, isMac, undo, cut, copy, paste, truncateString, getClipboard } from '.';

export const getEditMenu = (params: Electron.ContextMenuParams) => {
    const menu: Electron.MenuItemConstructorOptions[] = [
        {
            label: "Emoji",
            accelerator: `${specialKey}+.`,
            visible: !isMac,
            click: () => {
                app.showEmojiPanel()
            }
        },
        { type: "separator" },
        { role: "undo", accelerator: undo },
        { type: "separator" },
        { role: "cut", accelerator: cut, visible: !isMac, enabled: params.editFlags.canCut },
        { role: "copy", accelerator: copy, enabled: params.editFlags.canCopy },
        { role: "paste", accelerator: paste, enabled: params.editFlags.canPaste },
        { role: "delete", enabled: params.editFlags.canDelete },
        { type: "separator" },
        { role: "selectAll", accelerator: "CmdOrCtrl+A", enabled: params.editFlags.canSelectAll },
    ]

    return Menu.buildFromTemplate(menu);
}