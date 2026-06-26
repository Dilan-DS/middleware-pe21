import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
// importar las rutas v1 y v2 para iscripciones
import v1Inscripciones from "./routers/v1/inscripciones.js";
import v2Inscripciones from "./routers/v2/inscripciones.js";
import { requestLogger } from "./middlewares/logger.js";
import { requiereJwt } from "./middlewares/auth.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";

const app = express();
app.use(express.json()); // 1. Parseo del cuerpo
app.use(requestLogger); // 2. Logger
// app.use(requireApiKey); // 3. Autenticación
app.use(requiereJwt); // 3. Autenticación JWT
app.use(rateLimiter); // 4. Rate limiting
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/v1/inscripciones", v1Inscripciones);
app.use("/v2/inscripciones", v2Inscripciones);
// Manejador de errores: siempre al final, con cuatro parámetros
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Error interno del servidor" });
});
app.listen(3000, () => console.log("Servidor en puerto 3000"));
