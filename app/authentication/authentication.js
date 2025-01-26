const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');


const keycloakInternalUrl = 'http://keycloak:8080';
const keycloakIssuer = 'http://localhost:8080/realms/myapp';
const clientId = 'account';


const client = jwksClient({
  jwksUri: `${keycloakInternalUrl}/realms/myapp/protocol/openid-connect/certs`,
});


function getKey(header, callback) {
  client.getSigningKey(header.kid, (error, key) => {
    if (error) {
      console.error('Error retrieving signing key:', error);
      callback(error, null);
    } else {
      const publicKey = key.getPublicKey();
      callback(null, publicKey);
    }
  });
}


function authentication(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  jwt.verify(
    token,
    getKey,
    { audience: clientId, issuer: keycloakIssuer },
    (error, decoded) => {
      if (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded;
      next();
    }
  );
}

module.exports = authentication;