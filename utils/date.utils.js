const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Normalize date format and return a Date object
 * @param  {Number || Object} date
 * @return {Object}
 */
export function normalizeDate (date) {
    return typeof date === 'number' ? new Date(date) : date
}

/**
 * Format date 'smart' e.g Today || Yesterday || Monday, 5 March 2017
 * @param  {Date} date
 * @param  {Date} today
 * @return {String}
 */
export function formatDateSmart (date, today = new Date()) {
    const todayDate = today.getDate()
    const todayMonth = today.getMonth()
    const todayYear = today.getFullYear()
    const dayInMonth = date.getDate()
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()

    if (todayDate === dayInMonth && todayMonth === month && todayYear === year) {
        return 'today'
    } else if (todayDate === (dayInMonth + 1) && todayMonth === month && todayYear === year) {
        return 'yesterday'
    } else {
        return `${days[day]}, ${dayInMonth} ${monthsShort[month]} ${year}`
    }
}

/**
 * Format date in a "standard" way "Monday, 3 Oct 1988"
 * @param date
 * @returns {string}
 */
export function formatDateStandard (date) {
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()
    const dayInMonth = date.getDate()

    return `${days[day]}, ${dayInMonth} ${monthsShort[month]} ${year}`
}

/**
 * Dispatch date format method
 * @param  {Object || Number} date
 * @param  {String} format
 * @return {String}
 */
export function formatDate (date, format = '') {
    date = normalizeDate(date)
    switch (format) {
    case 'smart':
        return formatDateSmart(date)
    default:
        return formatDateStandard(date)
    }
}
