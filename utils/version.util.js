/**
 * Convert a version string (1.0.0) into an object
 * @param {String} versionString
 */
function getVersionObject (versionString) {
    const [major, minor, bug] = versionString.split('.')
    return { major: parseInt(major), minor: parseInt(minor), bug: parseInt(bug) }
}

/**
 * Stringify a version object
 * @param {Object} versionObject
 * @returns {string}
 */
function setVersionObject (versionObject) {
    return `${versionObject.major}.${versionObject.minor}.${versionObject.bug}`
}

/**
 * Bump version
 * @param {String} version
 * @param {String} type (major, minor, bug)
 * @param {Number} bump
 * @returns {String}
 */
function bumpVersion (version, type, bump = 1) {
    const versionObj = getVersionObject(version)

    if (type === 'major') {
        return setVersionObject({ major: versionObj.major + bump, minor: 0, bug: 0 })
    } else {
        return setVersionObject(Object.assign({}, versionObj, {
            [type]: versionObj[type] + bump
        }))
    }
}

module.exports = { getVersionObject, setVersionObject, bumpVersion }
