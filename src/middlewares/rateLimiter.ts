import { type Request, type Response, type NextFunction } from "express";

// Map guarda temporalmente cuantas peticiones hizo cada usuario/token
const requestCounts = new Map<string, { count: number; resetAt: number }>();
// ventana de tiempo del limite: 15 minutos en milisegundos
const WINDOW_MS    = 15 * 60 * 1000;  // 15 minutos

// maximo de peticiones permitidas dentro de esos 15 minutos
const MAX_REQUESTS = 10;               // reducido para las pruebas del lab

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // usa el token Authorization como clave para contar peticiones por usuario/token
  // si no hay token, usa la IP, y si tampoco hay IP usa "anon"
  const key = req.headers["authorization"] ?? req.ip ?? "anon";

  // fecha/hora actual en milisegundos
  const now = Date.now();
  // busca si ese token/IP ya tiene un contador guardado
  const entry = requestCounts.get(key);

  // si no existe contador o ya paso la ventana de 15 minutos, reinicia el contador
  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  // si ya llego al maximo de peticiones, bloquea con error 429
  if (entry.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    return res.status(429).json({ error: 'Demasiadas peticiones. Intenta mas tarde.' });
  }


  // si todavia no llega al limite, aumenta el contador
  entry.count++;
  next();
}