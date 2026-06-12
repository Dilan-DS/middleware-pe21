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