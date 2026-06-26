## Pruebas realizadas

### Escenario 1: Sin API key -> esperado 401

Comando ejecutado:

PS D:\Cuarto Ciclo\PROGRAMACION DE MIDDLEWARE Y SEGURIDAD DE LA BASE DE DATOS\Middleware\api-Dilan> curl http://localhost:3000/health

Salida real de la terminal:

{"error":"API key inválida o ausente"}

Explicación:

El servidor responde con error porque no se envió el header x-api-key. Por eso la petición es rechazada con estado 401.



### Escenario 2: Con clave válida -> esperado 200

Comando ejecutado:

PS D:\Cuarto Ciclo\PROGRAMACION DE MIDDLEWARE Y SEGURIDAD DE LA BASE DE DATOS\Middleware\api-Dilan> curl -H "x-api-key: secreto-demo" http://localhost:3000/health

Salida real de la terminal:

{"status":"ok","ts":"2026-06-11T21:30:33.676Z"}

Explicación:

El servidor responde correctamente porque se envió la clave válida secreto-demo. La ruta /health devuelve el estado del servicio y un timestamp.



### Escenario 3: Ruta inexistente -> esperado 404

Comando ejecutado:

PS D:\Cuarto Ciclo\PROGRAMACION DE MIDDLEWARE Y SEGURIDAD DE LA BASE DE DATOS\Middleware\api-Dilan> curl -H "x-api-key: secreto-demo" http://localhost:3000/noexiste

Salida real de la terminal:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /noexiste</pre>
</body>
</html>

Explicación:

El servidor responde con error 404 porque la ruta /noexiste no está definida en el proyecto.



## Verificación de TypeScript

Comando ejecutado:

PS D:\Cuarto Ciclo\PROGRAMACION DE MIDDLEWARE Y SEGURIDAD DE LA BASE DE DATOS\Middleware\api-Dilan> npx tsc --noEmit

Resultado:

La compilación termina sin errores.



## Testing

Para esta actividad se agregaron pruebas unitarias básicas con Jest y ts-jest para validar los middlewares del proyecto sin levantar el servidor.

Se probaron dos interceptores:

    requestLogger, para verificar que invoque   next() y registre el método y la ruta.
    requireApiKey, para verificar el comportamiento cuando la API key está ausente, incorrecta o válida.

Comando de ejecución:

    bash
npm test

Output real obtenido:
PS D:\Cuarto Ciclo\PROGRAMACION DE MIDDLEWARE Y SEGURIDAD DE LA BASE DE DATOS\Middleware\api-Dilan> npm test

> api-dilan@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js

(node:24012) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:21696) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  src/middlewares/logger.test.ts
 PASS  src/middlewares/auth.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.153 s
Ran all test suites.

## Pruebas de los endpoints

Servidor corriendo en `http://localhost:3000`. Autenticación: header `x-api-key: secreto-demo`.

### Escenario 1 — POST /v1/inscripciones con campos válidos (esperado: 201)

![v1 201 Created](docs/screenshots/01-v1-201.png)

### Escenario 2 — POST /v2/inscripciones con metodo_pago válido (esperado: 201)

![v2 201 Created](docs/screenshots/02-v2-201.png)

### Escenario 3 — POST /v2/inscripciones sin metodo_pago (esperado: 400)

![v2 400 campo faltante](docs/screenshots/03-v2-400-faltante.png)

### Escenario 4 — POST /v2/inscripciones con metodo_pago inválido (esperado: 400)

![v2 400 valor inválido](docs/screenshots/04-v2-400-invalido.png)

## Validación con Redocly

Se ejecutó el siguiente comando para validar el contrato OpenAPI:
npx @redocly/cli lint openapi.yaml 

![Redocly lint sin errores](docs/screenshots/TA-2.2/05-redocly-lint-ok.png)

## Cambios que realizaría

Si otro equipo empezara a consumir mi API mañana, mejoraría el contrato OpenAPI agregando descripciones más claras sobre las reglas que ya están definidas en el YAML, como el formato UUID del estudiante, la cantidad mínima de materias y los valores permitidos para el método de pago. También agregaría ejemplos de errores más específicos para que los desarrolladores sepan cómo corregir una solicitud cuando envíen datos inválidos.
## Seguridad JWT (PE-2.3)

### Generar un token de prueba

En PowerShell:

```powershell
# Con el secreto por defecto del laboratorio:
$env:JWT_SECRET="secreto-demo-pe23"
$TOKEN = node generate-token.mjs
echo $TOKEN

# Con secreto personalizado:
$env:JWT_SECRET="mi-secreto-largo"
$TOKEN = node generate-token.mjs
echo $TOKEN
```

### Probar el servicio

```powershell
# Petición válida (esperado: 201 Created)
curl -X POST http://localhost:3000/v2/inscripciones `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"estudianteId":"uuid-123","materias":["LTI_05A_458"],"periodoId":"2026-1","metodo_pago":"Efectivo"}'

# Token inválido por firma incorrecta (esperado: 401 Unauthorized)
curl -X POST http://localhost:3000/v2/inscripciones `
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" `
  -H "Content-Type: application/json" `
  -d '{}'

# Token con algoritmo no permitido alg:none (esperado: 401 Unauthorized)
curl -X POST http://localhost:3000/v2/inscripciones `
  -H "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0." `
  -H "Content-Type: application/json" `
  -d '{}'
```

### Variables de entorno

Copia `.env.example` a `.env` y configura `JWT_SECRET` con un valor secreto largo.

Ejemplo de `.env`:

```env
JWT_SECRET=secreto-demo-pe23
```

El archivo `.env` no debe subirse al repositorio. Solo se debe subir `.env.example`, ya que documenta las variables necesarias sin revelar el secreto real.
### Evidencias en Postman

#### Prueba 1 — Token válido: 201 Created

![Prueba 1 - Body enviado y respuesta 201](docs/screenshots/PE-2.3/PE23_prueba1_201_body.png)

![Prueba 1 - Header Authorization y respuesta 201](docs/screenshots/PE-2.3/PE23_prueba1_201_headers.png)

#### Prueba 2 — Firma inválida: 401 Unauthorized

![Prueba 2 - Firma inválida 401](docs/screenshots/PE-2.3/PE23_prueba2_401.png)

#### Prueba 3 — Token con alg none: 401 Unauthorized

![Prueba 3 - Algoritmo no permitido 401](docs/screenshots/PE-2.3/PE23_prueba3_401_body.png)