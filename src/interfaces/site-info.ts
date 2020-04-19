export interface IContent {
    url: string;
    type: 'webui' | 'file' | 'webpage';
    connectionType?: 'secure' | 'insecure';
    width: number;
    height: number;
}