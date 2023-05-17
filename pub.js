const zmq = require("zeromq")
const sock = new zmq.Publisher
sock.bind("tcp://127.0.0.1:3001")
console.log("Publisher bound to port 3001")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
urls = ['http://132.163.53.82:3000/query/status',
    'http://132.163.53.82:3100/query/sensors',
    'http://132.163.53.82:3300/query/state',
    'http://132.163.53.82:3400/lockins/query/sensors',
];

var still_fetching = false;
async function fetch_readings() {
    // var msg = await fetch('http://132.163.53.82:3000/query/status');
    if (!still_fetching) {
        still_fetching = true;
        var data={'TIME': Date.now()/1000};
        for (url of urls) {
            console.log('fetch:', url, Date().toString());
            var msg = await fetch(url);
            var response = await msg.json();
            console.log('main', response);
            // data = Object.assign({}, data, response);
            data = {...data, ...response};
        }
        sock.send(["DR_readings", JSON.stringify(data)])
        // sock.send(["kitty cats", "meow!"]);
        still_fetching = false;
    } else { console.log('busy processing earlier requests'); }
    return response;
}
async function fetch_diode() {
    var msg = await fetch('http://132.163.53.82:3100/query/sensors');
    var response = await msg.json();
    response.TIME = Date.now()/1000
    console.log('main', response);
    sock.send(["kitty cats", JSON.stringify(response)])
    // sock.send(["kitty cats", "meow!"]);
    return response;
}
// setInterval(fetch_diode, 10000);
setInterval(fetch_readings, 10000);
// fetch_compressor()
/*
async function run() {
    const sock = new zmq.Publisher

    await sock.bind("tcp://127.0.0.1:3001")
    console.log("Publisher bound to port 3001")

    while (true) {
        console.log("sending a multipart message envelope")
        let status = await fetch_compressor();
        await sock.send(["kitty cats", JSON.stringify(status)])
        await new Promise(resolve => { setTimeout(resolve, 5000) })
    }
}
*/
//run()
