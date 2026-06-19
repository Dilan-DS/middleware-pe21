import { describe, test, expect, jest } from "@jest/globals";
import { requireApiKey } from "./auth.js";
import { type Request, type Response, type NextFunction } from "express";

// Agrupamos las pruebas del middleware requireApiKey
describe("requireApiKey", () => {
  // Funcion para simular la respuesta de Express
  const crearResponseMock = () => {
    const res = {} as Response;

    // status devuelve res para poder encadenar status().json()
    res.status = jest
      .fn()
      .mockReturnValue(res) as unknown as Response["status"];

    // json devuelve res para completar la respuesta
    res.json = jest.fn().mockReturnValue(res) as unknown as Response["json"];

    return res;
  };

  // a) Cuando no existe el header x-api-key
  test("debe responder 401 cuando el header x-api-key esta ausente", () => {
    // Simular una peticion sin headers
    const req = {
      headers: {},
    } as Request;

    // Simular response y next
    const res = crearResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    // Ejecutar el middleware
    requireApiKey(req, res, next);

    // Verificar que responda con 401
    expect(res.status).toHaveBeenCalledWith(401);

    // Verificar que se envie el mensaje de error
    expect(res.json).toHaveBeenCalledWith({
      error: "API key inválida o ausente",
    });

    // Verificar que no pase al siguiente middleware
    expect(next).not.toHaveBeenCalled();
  });

  // b) Cuando la API key es incorrecta
  test("debe responder 401 cuando la API key es incorrecta", () => {
    // Simular una peticion con una clave incorrecta
    const req = {
      headers: {
        "x-api-key": "clave-incorrecta",
      },
    } as unknown as Request;

    const res = crearResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    // Ejecutar el middleware
    requireApiKey(req, res, next);

    // Verificar que responda con 401
    expect(res.status).toHaveBeenCalledWith(401);

    // Verificar que se envie el mensaje de error
    expect(res.json).toHaveBeenCalledWith({
      error: "API key inválida o ausente",
    });

    // Verificar que no pase al siguiente middleware
    expect(next).not.toHaveBeenCalled();
  });

  // c) Cuando la API key es correcta
  test("debe llamar a next() cuando la API key es valida", () => {
    // Simular una peticion con la clave correcta
    const req = {
      headers: {
        "x-api-key": "secreto-demo",
      },
    } as unknown as Request;

    const res = crearResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    // Ejecutar el middleware
    requireApiKey(req, res, next);

    // Verificar que pase al siguiente middleware
    expect(next).toHaveBeenCalled();

    // Verificar que no se envie una respuesta de error
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
