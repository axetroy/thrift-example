const fs = require('fs');
const thrift = require('thrift');
const Calculator = require('./gen-nodejs/Calculator');
const ttypes = require('./gen-nodejs/tutorial_types');
const SharedStruct = require('./gen-nodejs/shared_types').SharedStruct;

const ca = require('./ca');

const data = {};

const server = thrift.createServer(
  Calculator,
  {
    ping: function(result) {
      console.log('ping()');
      result(null);
    },

    add: function(n1, n2, result) {
      console.log('add(', n1, ',', n2, ')');
      result(null, n1 + n2);
    },

    calculate: function(logid, work, result) {
      console.log('calculate(', logid, ',', work, ')');

      let val = 0;
      if (work.op == ttypes.Operation.ADD) {
        val = work.num1 + work.num2;
      } else if (work.op === ttypes.Operation.SUBTRACT) {
        val = work.num1 - work.num2;
      } else if (work.op === ttypes.Operation.MULTIPLY) {
        val = work.num1 * work.num2;
      } else if (work.op === ttypes.Operation.DIVIDE) {
        if (work.num2 === 0) {
          const x = new ttypes.InvalidOperation();
          x.whatOp = work.op;
          x.why = 'Cannot divide by 0';
          result(x);
          return;
        }
        val = work.num1 / work.num2;
      } else {
        const x = new ttypes.InvalidOperation();
        x.whatOp = work.op;
        x.why = 'Invalid operation';
        result(x);
        return;
      }

      const entry = new SharedStruct();
      entry.key = logid;
      entry.value = '' + val;
      data[logid] = entry;

      result(null, val);
    },

    getStruct: function(key, result) {
      console.log('getStruct(', key, ')');
      result(null, data[key]);
    },

    zip: function() {
      console.log('zip()');
      result(null);
    }
  },
  {
    transport: thrift.TFramedTransport,
    protocol: thrift.TBinaryProtocol,
    tls: {
      key: ca.key,
      cert: ca.cert
      // This is necessary only if using the client certificate authentication.
      // requestCert: true,
      // // This is necessary only if the client uses the self-signed certificate.
      // ca: ca.ca
    }
  }
);

server.listen(9022);
