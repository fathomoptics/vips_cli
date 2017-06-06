var execFile = require("child_process").execFile;

module.exports.vips = function(...args) {
  return new Promise( (resolve, reject) => {
    return execFile('vips', args,
                    (error, stdout, stderr) =>
                    {
                      if(error) {
                        reject(error + "\n\n" + stderr);
                      }
                      resolve(stdout);
                    })
  });
};

module.exports.vipsheader = function(file) {
  return new Promise( (resolve, reject) => {
    return execFile('vipsheader', ['-a', file],
                    (error, stdout, stderr) =>
                    {
                      if(error) {
                        reject(error);
                      }

                      var a = stdout.split("\n");
                      a.pop();
                      a.shift(); // remove 1st and last
                      a.forEach( (e,i,a) => {
                        var k = e.split(':');
                        var s = (k[0] === "vips-loader" || k[0] === "xml-header"); // make vips-loader a string
                        var t = (k[0] === "format" || k[0] === "coding" || k[0] === "interpretation"); 
                        var u = k[0] === "xml-header";
                        k[0] = "\""+k[0]+"\"";
                        if(u) k[1] = k[1].split(",").shift(); // remove stuff after the ,
                        if(t) k[1] = k[1].split("-").shift(); // remove stuff after the -
                        if(s) k[1] = "\""+k[1].substring(1,k[1].length)+"\"";
                        a[i] = k.join(":");
                      });
                      resolve(JSON.parse("{"+a.join(",\n")+"}"));
                    })
  });
};
