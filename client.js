const fs = require('fs');
const thrift = require('thrift');
const Calculator = require('./gen-nodejs/Calculator');
const ttypes = require('./gen-nodejs/tutorial_types');

const ca = require('./ca');

const connection = thrift.createSSLConnection(
  // '192.168.8.198',
  'localhost',
  9022,
  {
    transport: thrift.TFramedTransport,
    protocol: thrift.TBinaryProtocol,
    rejectUnauthorized: false
    // key: ca.key,
    // cert: ca.cert,
    // ca: ca.ca
  },
  function(err) {
    if (err) throw err;
    console.log('connect to server...');
  }
);

connection.on('error', function(err) {
  console.error(err);
  // assert(false, err);
});

// Create a Calculator client with the connection
const client = thrift.createClient(Calculator, connection);

client.ping(function(err, response) {
  console.log('ping()');
});

client.add(1, 1, function(err, response) {
  console.log('1+1=' + response);
});

work = new ttypes.Work();
work.op = ttypes.Operation.DIVIDE;
work.num1 = 1;
work.num2 = 0;

client.calculate(1, work, function(err, message) {
  if (err) {
    console.log('InvalidOperation ' + err);
  } else {
    console.log('Whoa? You know how to divide by zero?');
  }
});

work.op = ttypes.Operation.SUBTRACT;
work.num1 = 15;
work.num2 = 10;

client.calculate(1, work, function(err, message) {
  console.log('15-10=' + message);

  client.getStruct(1, function(err, message) {
    console.log('Check log: ' + message.value);

    //close the connection once we're done
    connection.end();
  });
});
