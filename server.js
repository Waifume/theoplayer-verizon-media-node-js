const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;
const crypto = require('crypto');
const fs = require('fs');
const useragent = require('express-useragent');
let config;

function loadConfig() {
    config = JSON.parse(fs.readFileSync('config.json'));
    console.log(config);
}
loadConfig();

app.post('/asset', (req, res) => {
    getPreplayParameters(req, res);
});

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

function requiresFairplay(ua) {
    const isiOS = (ua.isiPhone || ua.isiPad || ua.isiPod || ua.isiPhoneNative);
    return (ua.isSafari || isiOS);
}

function addTime(days, hours, minutes, seconds) {
    let time = seconds;
    time = time + (minutes*60);
    time = time + (hours*60*60);
    time = time + (days*24*60*60);
    return time;
}

function getPreplayParameters(req, res) {
    const apiKey = config.secret;
    const body = req.body;
    console.log(body);
    const queryParams = {
        v: '2',
        tc: '1',
        exp: parseInt(Date.now()/1000)+addTime(parseInt(body.daysValid),0,30,0),
        rn: parseInt(Math.random()*1000000),
        ct: body.type
    };
    if (body.userId) {
        queryParams.eid = body.externalId;
        queryParams.oid = body.userId;
    } else {
        queryParams.cid = body.id;
    }
    let extraParams = body.extraQueryParams;
    if (extraParams) {
        extraParams = extraParams.split("&");
        for (let i = 0; i < extraParams.length; i++) {
            const keyValue = extraParams[i].split("=");
            if (keyValue.length == 2) {
                queryParams[keyValue[0]] = keyValue[1];
            }

        }
    }

    const useDrm = body.drm;
    if (useDrm) {
        const allowrmt = body.allowrmt;
        if (!allowrmt) {
            const source = req.headers['user-agent'],
                ua = useragent.parse(source);
            const requiresFairPlay = requiresFairplay(ua);
            const manifest = (requiresFairPlay) ? "m3u8" : "mpd";
            const requiresPlayReady = ua.isIE;
            const rmt = (requiresFairPlay) ? "fps" : (requiresPlayReady ? "pr" : "wv");
            if (!queryParams['manifest']) {
                queryParams['manifest'] = manifest;
            }
            if (!queryParams['rmt']) {
                queryParams['rmt'] = rmt;
            }
        } else {
            if (!queryParams['allowrmt']) {
                queryParams['allowrmt'] = 1;
            }
        }
    }
    let queryStr = jsonToQueryString(queryParams);
    let sig = crypto.createHmac("sha256", apiKey).update(queryStr).digest("hex");
    console.log("Your query string is on the back-end is", queryStr + "&sig="+sig);
    queryParams['sig'] = sig;
    res.send({preplayParameters: queryParams});
    return queryParams;
}