import https from 'https';
import { getHostname } from './url';
import { TLSSocket } from 'tls';

export const getCertificate = async (url: string) => {
    const options = {
        host: url,
        port: 443,
        method: "GET"
    };

    const res = await https.request(options)

    console.log(res.connection.getPeerCertificate())

    return ((res.connection) as TLSSocket).getPeerCertificate()
}