
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
console.log(fetch);
var msg = fetch('http://132.163.53.82:3000')
console.log(fetch);

fetch('http://132.163.53.82:3000')
    .then(res => res.text())
	.then(text => console.log('fetch hello:', text));

async function main() {
    var msg = await fetch('http://132.163.53.82:3000/query/status');
    var response = await msg.json();
    console.log('main', response);
    console.log(response['LowP']);
}
main()
console.log('done');
