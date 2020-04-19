import { app } from 'electron'
import { join } from 'path'

export const getAppPath = () => {
    if(process.env.ENV === 'dev') return app.getAppPath()
    return join(app.getAppPath(), "resources", "app.asar")
}