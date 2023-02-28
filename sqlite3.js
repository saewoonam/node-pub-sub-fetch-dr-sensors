const sqlite = require('better-sqlite3');
const path = require('path');

const dbname = 'calibration.db';
const tablename = 'DC2018';

const db = new sqlite(path.resolve(dbname), {fileMustExist: true});

console.log(db);

function query(sql) {
    console.log('query params:', sql);
    return db.prepare(sql).raw(true).all();
}

try {
    var data = query(`SELECT * FROM ${tablename}`);
    data = {'code': 'good', 'data':data};
    console.log( 'T', data['data'].map( (elt)=> elt[0]));
    console.log( 'V', data['data'].map( (elt)=> elt[1]));

} catch (error) {
    console.log('error', error);
    data = error;
}
console.log(data);

