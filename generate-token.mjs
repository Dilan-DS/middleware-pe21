import { createHmac, randomUUID } from 'crypto';

// secreto que se usa para firmar el token
// si no existe JWT_SECRET en el entorno, usa el secreto de prueba
const secret = process.env.JWT_SECRET ?? 'secreto-demo-pe23';

function base64url(str) {
  // Buffer convierte el texto a base64
  // replace cambia el formato base64 normal a base64url que usa JWT
  return Buffer.from(str).toString('base64')
  // busca todo los signos y lso cambia por -
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// header del JWT, aqui se indica el algoritmo y el tipo de token
const header  = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

// payload del JWT, aqui van los claims o datos del token
const payload = base64url(JSON.stringify({
  sub:   '20251042', // subject, representa al usuario o dueño del token
  iss:   'https://auth.uide.edu.ec', // issuer, quien emite el token
  aud:   'https://api.uide.edu.ec/inscripciones', // audience, API para la que sirve el token
  scope: 'inscripciones:write', // permisos que tiene el token
  exp:   Math.floor(Date.now() / 1000) + 3600, // expiracion del token, dura 1 hora
  jti:   randomUUID() // identificador unico del token
}));

// createHmac crea una firma segura con sha256 y el secreto
// update firma el header y payload unidos con punto
// digest genera el resultado final de la firma en formato base64url
const sig = createHmac('sha256', secret)
  .update(`${header}.${payload}`)
  .digest('base64url');

// imprime el token completo en formato header.payload.firma
console.log(`${header}.${payload}.${sig}`);