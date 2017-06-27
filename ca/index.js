/**
 * Created by axetroy on 17-6-27.
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  key: fs.readFileSync(path.join(__dirname, 'ryans-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ryans-cert.pem')),

  // This is necessary only if using the client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses the self-signed certificate.
  ca: [fs.readFileSync(path.join(__dirname, 'ryans-cert.pem'))]
};
