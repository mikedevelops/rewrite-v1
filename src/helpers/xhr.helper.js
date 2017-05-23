/**
 * Ajax request helper
 * @param  {String} uri
 * @param  {String} method
 * @param  {Object} headers
 * @return {Promise}
 */
export function request (uri, method = 'GET', headers = {}) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()

        request.open(method, uri)

        Object.keys(headers).forEach(header => {
            request.setRequestHeader(header, headers[header])
        })

        request.send()

        request.onreadystatechange = () => {
            const { readyState, status, statusText, response } = request

            if (readyState === XMLHttpRequest.DONE) {
                if (status === 200) {
                    resolve(response)
                } else {
                    reject(statusText)
                }
            }
        }
    })
}
