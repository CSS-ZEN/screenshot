import { IncomingMessage, ServerResponse } from 'http'
import auth from 'basic-auth'
import HTTPStatusCodes from '../statusCode'
import {
    compareCredentials,
    parseCredentials,
    AuthCredentials,
} from './credentials'

export type MiddlewareOptions = {
    realm?: string
    users?: AuthCredentials
}

/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */
const basicAuthMiddleware = async (
    req: IncomingMessage,
    res: ServerResponse,
    {
        realm = 'protected',
        users = []
    }: MiddlewareOptions = {}) => {
    // Check if credentials are set up
    const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
    if (environmentCredentials.length === 0 && users.length === 0) {
        // No credentials set up, continue rendering the page as normal
        return { ok: true, result: null }
    }

    const credentialsObject: AuthCredentials =
        environmentCredentials.length > 0
            ? parseCredentials(environmentCredentials)
            : users

    const currentUser = auth(req)
    if (!currentUser || !compareCredentials(currentUser, credentialsObject)) {
        res.statusCode = HTTPStatusCodes.UNAUTHORIZED
        res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
        return { ok: false, result: res.end('401 Access Denied') }
    }
    return { ok: true, result: null }
}

export default basicAuthMiddleware