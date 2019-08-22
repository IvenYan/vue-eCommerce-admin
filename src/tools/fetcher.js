import 'whatwg-fetch';
const reqHeaders = {
    Accept: 'application/json',
    sysCode: 'market',
    'token': localStorage.token || ''
};
const request = (url, init) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json();
        };
    });
};
const json2Url = (params) => {
    let arr = [];
    let str;
    for (let i in params) {
        str = i + '=' + params[i];
        arr.push(str);
    }
    return arr.join('&');
};
export default {
    get (url, params) {
        return request(url, {
            method: 'GET',
            headers: reqHeaders
            // body: '?' + json2Url(params)
        });
    },
    post (url, params) {
        return request(url, {
            method: 'POST',
            headers: Object.assign({}, reqHeaders, {
                'Content-type': 'application/x-www-form-urlencoded'
            }),
            body: json2Url(params)
        });
    }
};
