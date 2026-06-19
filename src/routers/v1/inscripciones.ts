import { type Request, type Response, Router } from "express";

//
const router = Router();

//post : estudianteId, Materias(arreglo), periodoId - Registrar matricula
router.post("/", (req: Request, res: Response, next) => {
  // declarando una bariable consts = req.body
  //2 acediendo a los atributos
  const { estudianteId, materias, periodoId } = req.body;
  // validar la informacion este correta
  //   if (!estudianteId) console.error("No existe el id del estudiante ");
  if (!estudianteId || !materias.length || !periodoId) {
    console.error("No existe el id del estudiante ");
    res.status(400).json({
      error: "Campos requeridos: estudianteId, materias, peridodoId",
    });
  }

  res.status(201).json({
    version: "v1",
    message: {
      estudianteId,
      materias,
      periodoId,
    },
  });
  // if(materias?.length == 0) console.error("No existe ninguna materia asignada ")
  //   if (materias?.length) console.error("No existe ninguna materia asignada ");
  //   if (!periodoId) console.error("No existe el id del periodo");
});

export default router;
