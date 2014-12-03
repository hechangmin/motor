/**
 * session 管理
 * @author  hechangmin@gmail.com
 * @date 2014-11-27
 */

var crypto = require("crypto");

//key中字符不要包含0~9及abcdef
var key = 'motor';
var sessionId = '';


exports.createToken = function(res, user) {
	var secret = crypto.createHash('md5').update(user + key).digest('hex');
	var q1 = (+new Date()).toString(16);
	var q2 = parseInt(secret.length * Math.random());
	var q3 = key.charAt(parseInt(key.length * Math.random()));
	var q4 = q1.length;
	var token = q3 + secret.substr(q2) + q1 + secret.substr(0, q2) + q3 + q4 + q3 + q2;
	//console.log(q4, '|', q1, '|', q2, '|', q3, '|', secret);

	res.setCookie('token', token, {
		httponly: 'httponly',
		path: '/'
	});

	return token;
};

exports.createSID = function(h) {
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

var _parse = function(token) {
	var q3 = token.charAt(0);
	var arrToken = token.split(q3);
	var q2 = parseInt(arrToken[arrToken.length - 1]);
	var q4 = parseInt(arrToken[arrToken.length - 2]);
	var len = 32 + q4;
	var secret = arrToken[1];
	var q1 = secret.substr(32 - q2, q4);
	secret = secret.substr(len - q2) + secret.substr(0, 32 - q2);
	//console.log(q4, '|', q1, '|', q2, '|', q3, '|', secret);
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
			output = this.returnBase(MSD, base) + convert[LSD];
		} else {
			output = convert[MSD] + convert[LSD];
		}
	}
	return output;
};

var rand = function(max) {
	return Math.floor(Math.random() * max);
};