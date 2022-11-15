var fs = require('fs');
var jsonFile = "./theAirdop.json";
var parsed= JSON.parse(fs.readFileSync(jsonFile));
export const theAirdropAbi = parsed.abi;
