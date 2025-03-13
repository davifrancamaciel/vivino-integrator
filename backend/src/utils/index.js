const getVivinoUrl = (vivinoClientId) => {
    const { VIVINO_API_URL } = process.env
    return !vivinoClientId.includes('TESTING') ? VIVINO_API_URL.replace('testing.', '') : VIVINO_API_URL
}

const sum = function (items, prop) {
    return items.reduce(function (a, b) {
        return a + b[prop];
    }, 0);
};
module.exports = { getVivinoUrl, sum };
