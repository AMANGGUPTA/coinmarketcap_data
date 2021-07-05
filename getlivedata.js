const https = require('https');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'coindata',
    password: '8178541244',
    port: 5432,
})

/*const ids = [
    2781, 3526, 3537, 2821, 3527, 2782, 3528, 3531, 3530, 3533, 3532, 2832, 3529, 2783, 2814, 3549, 2784, 2786, 2787, 2820, 3534, 2815, 3535, 2788, 2789, 3536, 3538, 2790, 3539, 3540, 3541, 3542, 2792, 2793, 2818, 2796, 2794, 3544, 3543, 2795, 3545, 2797, 3546, 3551, 3547, 3550, 3548, 3552, 3556, 2800, 2816, 2799, 3555, 3558, 3554, 3557, 3559, 3561, 2811, 2802, 3560, 2819, 2801, 3562, 2804, 3563, 2822, 2803, 2805, 2791, 3564, 2817, 2806, 3566, 3565, 2808, 2812, 2798, 3567, 3573, 3553, 2807, 2785, 2809, 3569, 3568, 2810, 3570, 2824, 2813, 3571, 3572, 2823, 1, 1027, 2010, 1839, 6636, 52, 1975, 2, 512, 1831, 7083, 74, 9023, 9022
];*/

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
    9022,
    1817,3783,2099,2577,7064,8104,5068,4558,2405,2222,5777,3640,693,2539,5632,5161,291,4948,1214,1982,1934,4206,3964,1455,3673,4846,3911,4269,1772,3012,3306,1659,7501,1759,1886,8646,1762,1637,2297,5691,1343,8891,5117,7334,7226,4679,4120,3217,2300,5026,6951,7288,3773,4279,2273,2777,1776,1757,2758,5268,5444,1104,6210,1320,6187,1732,3437,1816,4761,3835,6841,3814,8202,2780,1230,5728,2570,3351,4189,2424,1680,2303,1552,3418,5370,3748,463,7232,8911,1586,4056,3884,3701,1788,2840,2776,5488,2930,2496,4705,1,1027,2010,1839,6636,52,1975,2,512,1831,7083,74,9023,9022
];

pool.query('Delete From public.coins', (error, results) => {
    if (error) {
        throw error
    }
})

var str = "";

const options = {
    hostname: 'web-api.coinmarketcap.com',
    path: 'https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=' + ids.toString() + '&convert_id=2781',
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

        ids.forEach(function (id) {

            var quote = jsonObject.data[id];

            try {
                var details = quote["quote"][2781];
                if (details) {
                    pool.query('INSERT INTO public.coins(coin_id, name, symbol, price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, percent_change_60d, percent_change_90d, market_cap, last_updated)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
                        [quote.id, quote.name, quote.symbol, details.price, details.volume_24h, details.percent_change_1h, details.percent_change_24h, details.percent_change_7d, details.percent_change_30d, details.percent_change_60d, details.percent_change_90d, details.market_cap, details.last_updated], (error, results) => {
                            if (error) {
                                throw error
                            }
                        })
                }
            }
            catch (err) {
            }

        });

        console.log("Completed");
    });
})

req.on('error', error => {
    console.error(error)
})

req.end()





