const getVivinoUrl = (vivinoClientId) => {
    const { VIVINO_API_URL } = process.env
    return !vivinoClientId.includes('TESTING') ? VIVINO_API_URL.replace('testing.', '') : VIVINO_API_URL
}

module.exports = { getVivinoUrl };
