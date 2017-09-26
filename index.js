/* jslint esversion: 6 */
var execFile = require("child_process").execFile;

module.exports.vips = function(...args) {
  return new Promise( (resolve, reject) => {
    return execFile('vips', args,
                    (error, stdout, stderr) =>
                    {
                      if(error) reject(error + "\n\n" + stderr);
                      resolve(stdout);
                    });
  });
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.vipsheader = function(file) {
  return new Promise( (resolve, reject) => {
    return execFile('vipsheader', ['-a', file],
                    (error, stdout, stderr) =>
                    {
                      if(error) reject(error);

                      var a = stdout.split("\n");
                      a.pop();
                      a.shift(); // remove 1st and last
                      a.forEach( (e,i,a) => {
                        var k = e.split(':');
                        var s = (k[0] === "vips-loader" || k[0] === "xml-header"); // make vips-loader a string
                        var t = (k[0] === "format" || k[0] === "coding" || k[0] === "interpretation"); 
                        k[0] = "\""+k[0]+"\"";
                        if(t) k[1] = k[1].split("-").pop(); // remove stuff before the -
                        if(s) k[1] = "\""+k[1].substring(1,k[1].length)+"\"";
                        k[1] = k[1].trim();
                        if(!isNumeric(k[1]) && k[1][0] !== '"')
                          k[1]='"'+k[1]+'"';
                        a[i] = k.join(":");
                      });
                      resolve(JSON.parse("{"+a.join(",\n")+"}"));
                    });
  });
};
