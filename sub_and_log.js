const zmq = require("zeromq")

const sqlite3 = require('better-sqlite3');
var db = sqlite3('log.db');

var sensor_dict;
// retrieve all sensors (compressor + diodes)

function fetch_sensors(table) {    
    var stmt = db.prepare(`select * from ${table}`);
    stmt.raw(true);
    var results = stmt.all()
    // console.log('stmt', stmt);
    let sensor_dict = {}
    for (elt of results) {
        // console.log('elt', elt);
        sensor_dict[elt[1]] = {}
        sensor_dict[elt[1]]['id'] = elt[0];
        sensor_dict[elt[1]]['cal_file'] = elt[3];
    }
    return sensor_dict;
}

sensor_dict = {...sensor_dict, ...fetch_sensors('compressor_list')};
sensor_dict = {...sensor_dict, ...fetch_sensors('diode_list')};
console.log(sensor_dict);

const create = 'CREATE TABLE IF NOT EXISTS data ( TS INT, ID INT , READING REAL);'
results = db.exec(create);
console.log(results);
var insert = db.prepare(`INSERT INTO data VALUES (?, ?, ?);`);
// var stmt;

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://127.0.0.1:3001")
  sock.subscribe("")
  console.log("Subscriber connected to port 3001")

  for await (const [topic, msg] of sock) {
    // console.log("received a message related to:", topic, "containing message:", msg, msg.toString())
    let data = JSON.parse(msg.toString());
    //  console.log('topic:', topic.toString(), 'received message:', JSON.stringify(data));
    //console.log("received a message related to:", topic, "containing message:", JSON.parse(msg.toString()));
    // console.log(Object.keys(data));
    
    //Object.keys(data).forEach( (element) => {
    var array = Object.keys(data).map( (element) => {
        // Loop through data from the webservers... need to find id for database
        //   in the database the key may be mixed case (sensor_dict)
        //  Try to find the elt in the sensor_dict to get the id
        // let idx = Object.keys(sensor_dict).findIndex( (elt) => {
        let idx = Object.keys(sensor_dict).find( (elt) => {
            return element.toUpperCase() == elt.toUpperCase();
        });
        if (idx === undefined) {
            ;
        } else {
            console.log('found idx', idx, element, data.TIME, sensor_dict[idx]['id'], data[element]);
            var TS = data.TIME;
            var ID = sensor_dict[idx]['id'];
            var RAW = data[element];
            // stmt = db.prepare(insert);
            // stmt.run(TS, ID, RAW);
            return [TS, ID, RAW];
        }
    });
    console.log(array);
    console.log(array[0]!==undefined);
    array = array.filter( elt => elt!==undefined);
    const insertMany = db.transaction( (items) => {
        for (const item of array) insert.run(item);
    });
    insertMany(array);
    console.log('just inserted many');
  }
}

run()
