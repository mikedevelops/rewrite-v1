import { request } from '../helpers/xhr.helper'

const apiBase = 'http://localhost:3000/api/'

/**
 * Make a request to the api
 * @param  {String} apiPath
 * @return {Promise}
 */
export function apiGET (apiPath) {
    const path = apiBase + apiPath
    return new Promise((resolve, reject) => {
        request(path, 'GET')
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}
