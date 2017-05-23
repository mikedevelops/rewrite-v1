/**
 * Capatalize a string
 * @param {String} string
 * @returns {string} capatalized string
 */
export function capatalize (string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1)
}
