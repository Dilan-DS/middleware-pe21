import { type Request, type Response, Router } from "express";
import { error } from "node:console";

//
const router = Router();
const METODO_PAGO = ["Efectivo", "Transferencia", "Debito", "Credito"];
//post : estudianteId, Materias(arreglo), periodoId metodo de pago- Registrar matricula
router.post("/", (req: Request, res: Response, next) => {
  // declarando una bariable consts = req.body
  //2 acediendo a los atributos
  const { estudianteId, materias, periodoId, metodo_pago } = req.body;
  // validar la informacion este correta
  //   if (!estudianteId) console.error("No existe el id del estudiante ");
  if (!estudianteId || !materias.length || !periodoId || !metodo_pago) {
    console.error("No existe el id del estudiante ");
    res.status(400).json({
      error:
        "Campos requeridos: estudianteId, materias, peridodoId, metodo_pago",
    });
  }
  if (!METODO_PAGO.includes(metodo_pago)) {
    console.error("el metodo del pago insertaod no es valido ");
    res.status(400).json({
      error:
        "El metodo de pago insertado debe ser: efectivo, debito, credito o transferencia",
    });
  }

  res.status(201).json({
    version: "v2",
    message: {
      estudianteId,
      materias,
      periodoId,
      metodo_pago,
    },
  });
});

export default router;
