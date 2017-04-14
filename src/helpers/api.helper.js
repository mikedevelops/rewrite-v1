import { request } from 'Helpers/xhr.helper'

const apiUri = 'http://localhost:3000/api/'

/**
 * Make a request to the api
 * @param  {String} apiPath
 * @return {Promise}
 */
export function apiGet (apiPath) {
    return new Promise((resolve, reject) => {
        request(apiUri + apiPath, 'GET', { 'Content-Type': 'application/json' })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}
