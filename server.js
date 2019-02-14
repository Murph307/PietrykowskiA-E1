var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'calcDistance')
    {
      result = calcDistance(query);
    }
    else if (query['cmd'] == 'calcCost')
    {
      result = calcCost(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function calcDistance(query)
{
  if (query['budget'] == undefined || query['mpg'] == undefined ||  query['fuelCost'] == undefined)  
    throw Error("You must specify a budget, mpg, and the cost of fuel." );
  if (query['budget'] < 0 || query['mpg'] < 0 ||  query['fuelCost'] < 0)  
    throw Error("All values must be greater than or equal to 0." );
    
  var distance = 0;
  var budget = parseInt(query['budget']);
  var mpg = parseInt(query['mpg']);
  var fuelCost = parseInt(query['fuelCost']);
  
  distance = (budget / fuelCost) * mpg;
    
  var result = {'distance' : distance}; 
  return result;
}
function calcCost(query)
{
  if (query['distance'] == undefined || query['mpg'] == undefined ||  query['fuelCost'] == undefined)  
    throw Error("You must specify a budget, mpg, and the cost of fuel." );
  if (query['distance'] < 0 || query['mpg'] < 0 ||  query['fuelCost'] < 0)  
    throw Error("All values must be greater than or equal to 0." );
    
  var cost = 0;
  var distance = parseInt(query['distance']);
  var mpg = parseInt(query['mpg']);
  var fuelCost = parseInt(query['fuelCost']);
  
  cost = (distance / mpg) * fuelCost;
    
  var result = {'cost' : cost}; 
  return result;
}