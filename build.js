var ncp = require('ncp').ncp;

ncp.limit = 16;
 
ncp("assets", "dist/assets", function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done!');
});
