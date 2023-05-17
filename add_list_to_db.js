const sqlite3 = require('better-sqlite3');

const dbname = 'log.db';
// const dbname = 'log-test.db';

function read_yaml(filename) {
    const yaml = require('js-yaml');
    const fs   = require('fs');
    let doc;
    try {
      // doc = yaml.load(fs.readFileSync('diode_list.yaml', 'utf8'));
      // doc = yaml.load(fs.readFileSync('compressor.yaml', 'utf8'));
      doc = yaml.load(fs.readFileSync(filename, 'utf8'));
      console.log(doc);
      return doc;
    } catch (e) {
      console.log(e);
    }
}

function create_table_from_dict(name, doc, id) {
    
    const create = `CREATE TABLE IF NOT EXISTS ${name} ( ID INT , NAME TEXT, RAW_UNIT TEXT, CALFILE TEXT);`

    let db = sqlite3(dbname);
    let result = db.exec(create);
    console.log(result);
    // let id = 100;
    let insert = ''
    for (key in doc) {
      insert = `INSERT INTO ${name} VALUES (?, ?, ?, ?);`;
      console.log(insert);
      let stmt = db.prepare(insert);
      stmt.run(id, key, doc[key]['unit'], doc[key]['calibration']);
      id++;
    }
    db.close()
}
var doc;
/*
 * Already inserted into database 
doc = read_yaml('compressor.yaml');
create_table_from_dict('compressor_list', doc, 0);
doc = read_yaml('diode_list.yaml');
create_table_from_dict('diode_list', doc, 100);
doc = read_yaml('heaters.yml');
create_table_from_dict('heaters_list', doc, 200);
*/
doc = read_yaml('lockins.yaml');
create_table_from_dict('lockins_list', doc, 300);

