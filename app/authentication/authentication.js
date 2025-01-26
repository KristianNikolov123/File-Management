import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const keycloakInternalUrl = 'http://keycloak:8080';
const keycloakIssuer = 'http://localhost:8080/realms/myapp';

const clientId = 'account';

const client = jwksClient({
  jwksUri: `${keycloakInternalUrl}/realms/myapp/protocol/openid-connect/certs`, 
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, key.getPublicKey());
    }
  });
};

const authentication = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: clientId,
      issuer: keycloakIssuer,
    },
    (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded; 
      next();
    }
  );
};

export default authentication;