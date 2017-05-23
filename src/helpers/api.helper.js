import { request } from 'Helpers/xhr.helper'

const apiBase = 'http://localhost:3000/api/'

/**
 * Make a request to the api
 * @param  {String} apiPath
 * @return {Promise}
 */
export function apiGET (apiPath) {
    const start = performance.now()
    const path = apiBase + apiPath

    return new Promise((resolve, reject) => {
        request(path, 'GET')
            .then(res => {
                console.log(`Request time | ${path} | ${(performance.now() - start).toFixed(2)}ms`)
                resolve(res)
            })
            .catch(err => reject(err))
    })
}
