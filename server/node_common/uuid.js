/**
 * 获取uuid
 * 
 * @author  hechangmin@gmail.com
 * @date 2014-12-03
 */

exports.init = function(h) {
    h = h || '';
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = getIntegerBits(t, 0, 31);
    var tm = getIntegerBits(t, 32, 47);
    var thv = getIntegerBits(t, 48, 59) + '1';
    var csar = getIntegerBits(rand(4095), 0, 7);
    var csl = getIntegerBits(rand(4095), 0, 7);

    var n = getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 15);
    return tl + h + tm + h + thv + h + csar + csl + h + n;
};

var getIntegerBits = function(val, start, end) {
    var base16 = returnBase(val, 16);
    var quadArray = [];
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] === '') quadString += '0';
        else quadString += quadArray[i];
    }
    return quadString;
};

var returnBase = function(number, base) {
    var convert = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var output;
    var MSD;
    var LSD;

    if (number < base) {
        output = convert[number];
    } else {
        MSD = '' + Math.floor(number / base);
        LSD = number - MSD * base;
        if (MSD >= base) {
            output = returnBase(MSD, base) + convert[LSD];
        } else {
            output = convert[MSD] + convert[LSD];
        }
    }
    return output;
};

var rand = function(max) {
    return Math.floor(Math.random() * max);
};