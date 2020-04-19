import { clipboard } from 'electron'

export const isMac = process.platform == "darwin"
export const specialKey = isMac ? "Cmd" : "Super"

export const undo = "CmdOrCtrl+Z"
export const cut = "Ctrl+X"
export const copy = "CmdOrCtrl+C"
export const paste = "CmdOrCtrl+V"
export const selectAll = "CmdOrCtrl+A"

export const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '…'
}

export const getClipboard = () => {
    const text = clipboard.readText();

    text.replace(/\n/g, "")

    return text;
}