import { type Request, type Response, type NextFunction } from "express";
import { createHmac, timingSafeEqual } from "crypto";

//JSON WEB TOKEN - JWT

const JWT_SECRET = process.env.JWT_SECRET ?? "";

function base64UrlDecode(str: string): string {
  //Buffer manejar datos binarios dentro de node 
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

export function requiereJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"] ?? '';
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : '';

  if(!token) return res.status(401).json({ error: 'Token ausente'})
    //split separar un texto en partes 
  const parts = token.split('.') ;
  if(parts.length !==3) return res.status(401).json({error: 'Token malformado' })

    // as any q eso puede hacer cualquier cosa 
  const[headersB64, payloadB64, signatureB64] = parts as Array <string>;

  const header = JSON.parse (base64UrlDecode(headersB64 as string))
  // alg tipo 
  if (header.alg !== 'HS256') return res.status(401).json({ error: 'Algoritmo no permitido'})
  
  // firma esperada , createHmac crea una firma segura , digest sirve para genenra el resultado final de la firma 
  const expectedSig = createHmac('sha256', JWT_SECRET).update(`${headersB64}.${payloadB64}`).digest('base64url');
  //  timingSafeEqual comparar dos valores de forma segura 
  // solo funciona si los dos Buffer tienen el mismo tamaño.
  if (!timingSafeEqual(Buffer.from(signatureB64 as string), Buffer.from(expectedSig))) {
    return res.status(401).json({ error: 'Firma invalida' });
  }
  
  // GUARDAS LOS PYLOADS
  const claims =  JSON.parse(base64UrlDecode(payloadB64 as string))
  
  // Validar claims obligatorios
  // Math.floor quita los decimales 
  const now = Math.floor(Date.now() / 1000); // convierte el tiempo actual de milisegundos a segundos 
  //.exp efcha de expiracion del token para saber cuando caduca 
  // .exp espera la respuesta en segundos 
  if (claims.exp && claims.exp < now) return res.status(401).json({ error: 'Token expirado' });
  //.sub representa al usuario o al dueño del token 
  if (!claims.sub) return res.status(401).json({ error: 'Claim sub ausente' });

  (req as Request & { user?: unknown }).user = { sub: claims.sub, scope: claims.scope ?? '' };
  next();
}

export function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
// funcion de tipo void solo va a ejecutar un proceso no retorno un valor
): void {
  const key = req.headers["x-api-key"];
  if (key !== "secreto-demo") {
    res.status(401).json({ error: "API key inválida o ausente" });
    return;
  }
  next();
}
