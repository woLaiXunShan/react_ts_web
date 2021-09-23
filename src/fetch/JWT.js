/* eslint-disable no-unused-vars */

const md5 = require('js-md5')
function encode(str){
    // 对字符串进行编码
    var encode = encodeURI(str);
    // 对编码的字符串转化base64
    var base64 = btoa(encode);
    return base64;
}
export function signEvent(url) {
    let userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null

    var param = {
		"expire": new Date().getTime() + 5 * 60 * 1000,
		"userId": userInfo ? userInfo.id : null,
		"url": url
	}
	var token = userInfo ? userInfo.token : '' //密钥为当前登录token

	var keyArr = Object.keys(param);
	keyArr.sort()

    var source = "";
    // eslint-disable-next-line array-callback-return
    keyArr.map(item => {
        source += item + "=" + param[item] + "&";
    })

	
	source += "token=" + token;


	var sign = md5(source);
	param.sign = sign;

	var jsonParam = JSON.stringify(param);

	var base64Sign = window.btoa(jsonParam);
    return base64Sign
}





//JWT加密和普通base64加密不一样
// import CryptoJS from 'crypto-js'

// function base64UrlEncode(str) {
//     var encodedSource = CryptoJS.enc.Base64.stringify(str);
//     var reg = new RegExp('/', 'g');
//     encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_');
//     return encodedSource;
// }

// export function JWTsign(url) {
//     let userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null
//     let header = JSON.stringify({
//         "alg": "HS256",
//         "typ": "JWT"
//     })

//     let payload = JSON.stringify({
//         "url": url,
//         "userId": userInfo ? userInfo.id : null,
//         "expire": new Date().getTime() + 5 * 60 * 1000
//     });

//     let secretSalt = userInfo ? userInfo.token : '' //密钥为当前登录token

//     let before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload));

//     let signature = CryptoJS.HmacSHA256(before_sign, secretSalt);
//     signature = base64UrlEncode(CryptoJS.enc.Utf8.parse(signature));

//     let finalSign = before_sign + '.' + signature;
//     //final_sign:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2NhciIsInJvbGUiOiJhZG1pbiIsImV4cGlyYXRpb25EYXRhIjoiMjAxOC0xMC0yNCAxNzowNTowMCJ9.bVc48JsxiM7ZZgtZch1QnRpLyt08M9LepwoLvs_aejI
//     return finalSign
// }