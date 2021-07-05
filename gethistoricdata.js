const https = require('https');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'coindata',
    password: '8178541244',
    port: 5432,
})

var index = 0;
const delayExecution = 10000;
const ids = [
    1,
    1027,
    825,
    1839,
    2010,
    74,
    52,
    3408,
    6636,
    4687,
    7083,
    1831,
    2,
    5426,
    1975,
    3890,
    3717,
    512,
    1321,
    2416,
    8916,
    4943,
    3077,
    2280,
    1958,
    1765,
    328,
    5994,
    7278,
    3635,
    3602,
    4030,
    1518,
    4195,
    4023,
    4256,
    1376,
    2011,
    7186,
    4172,
    6945,
    3794,
    3957,
    1720,
    7129,
    3822,
    5805,
    2502,
    1168,
    4642,
    3718,
    5692,
    5034,
    1274,
    6719,
    2563,
    6892,
    2700,
    4066,
    4157,
    1437,
    131,
    2394,
    5864,
    873,
    5665,
    2634,
    2682,
    4847,
    5567,
    2469,
    6758,
    2130,
    8335,
    6535,
    1697,
    3330,
    1966,
    3155,
    2083,
    2586,
    2694,
    1727,
    2135,
    1684,
    1698,
    109,
    3945,
    1567,
    6538,
    3897,
    1042,
    2566,
    2499,
    1896,
    4779,
    2087,
    1808,
    3513,
    5617,
    9023,
    9022
];

function mysleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getData() {
    if (index < ids.length) {
        var currentId = ids[index];
        var str = "";

        const options = {
            hostname: 'api.coinmarketcap.com',
            path: '/data-api/v3/cryptocurrency/historical?id=' + currentId + '&convertId=2781&timeStart=1561919400&timeEnd=1625210599',
            headers: {
                "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36'
            },
            method: 'GET',
            json: true
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', function (chunk) {
                str += chunk;
            });

            res.on('end', function () {
                var jsonObject = JSON.parse(str);
                console.log(jsonObject.data.name);

                var name = jsonObject.data.name;
                var symbol = jsonObject.data.symbol;

                jsonObject.data.quotes.forEach(function (quote) {
                    pool.query('INSERT INTO public.coindata("close", "high", "low", "marketCap", "name", "open", "symbol", "timeClose", "timeHigh", "timeLow", "timeOpen", "volume", "timestamp")VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
                        [quote.quote.close, quote.quote.high, quote.quote.low, quote.quote.marketCap, name, quote.quote.open, symbol, quote.timeClose, quote.timeHigh, quote.timeLow, quote.timeOpen, quote.quote.volume, quote.quote.timestamp], (error, results) => {
                            if (error) {
                                throw error
                            }
                        })
                });

                console.log(name + " Completed");
                mysleep(delayExecution).then(() => { index++; getData(); });
            });
        })

        req.on('error', error => {
            console.error(error)
        })

        req.end()
    }
}

getData();





