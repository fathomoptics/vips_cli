/* jslint esversion: 6 */
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);


module.exports.vips = async function(...args) {
  const {stdout, stderr} = await execFile('vips', args);
  return stdout;
};


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.vipsheader = async function(file) {
  const { stdout } = await execFile('vipsheader', ['-a', file]);
  let a = stdout.split('\n');
  a.pop();
  a.shift(); // remove 1st and last
  a.forEach( (e,i,a) => {
    var k = e.split(':');
    var s = (k[0] === 'vips-loader' || k[0] === 'xml-header'); // make vips-loader a string
    var t = (k[0] === 'format' || k[0] === 'coding' || k[0] === 'interpretation');
    k[0] = '"' + k[0] + '"';
    if(t) k[1] = k[1].split('-').pop(); // remove stuff before the -
    if(s) k[1] = '"' + k[1].substring(1, k[1].length) + '"';
    k[1] = k[1].trim();
    if(!isNumeric(k[1]) && k[1][0] !== '"')
      k[1]='"'+k[1]+'"';
    a[i] = k.join(':');
  });
  return JSON.parse('{' + a.join(',\n') + '}');
};
