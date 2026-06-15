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