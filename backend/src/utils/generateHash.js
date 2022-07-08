"use strict";

const generateHash = () => {
    const numbers = '0123456789';
    const chars = 'acdefhiklmnoqrstuvwxyz';
    const string_length = 4;
    let randomstring = '';
    let randomstring2 = '';
    for (let x = 0; x < string_length; x++) {        
        const rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    for (let y = 0; y < string_length; y++) {
        const rnum2 = Math.floor(Math.random() * numbers.length);
        randomstring2 += numbers.substring(rnum2, rnum2 + 1);
    }
    return `${randomstring.toUpperCase()}${randomstring2}`;
}

module.exports = generateHash