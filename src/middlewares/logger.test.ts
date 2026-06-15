import { describe, test, expect, jest } from "@jest/globals";
import { requestLogger } from "./logger.js";
import { type Request, type Response, type NextFunction } from "express";

// Agrupamos las pruebas del middleware requestLogger
describe("requestLogger", () => {
  // Verificar que el middleware llame correctamente a next()
  test("debe llamar a next() al recibir una peticion", () => {
    // Simulacion de una peticion GET hacia /health
    const req = {
      method: "GET",
      path: "/health",
    } as Request;

    // Simulacion de una respuesta de Express
    const res = {
      statusCode: 200,
      on: jest.fn(),
    } as unknown as Response;

    // Simulacion de la funcion next()
    const next = jest.fn() as unknown as NextFunction;

    // Ejecutar el middleware
    requestLogger(req, res, next);

    // Verificar que next() fue llamado
    expect(next).toHaveBeenCalled();
  });

  // Verificar que se registre el metodo, la ruta y el codigo de estado
  test("debe registrar el metodo y la ruta correctamente", () => {
    // Espiar console.log para revisar lo que imprime
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Guardar el callback del evento finish
    let finishCallback: () => void = () => {};

    // Simulacion de una peticion GET hacia /health
    const req = {
      method: "GET",
      path: "/health",
    } as Request;

    // Simulacion de una respuesta de Express con evento finish
    const res = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          finishCallback = callback;
        }
      }),
    } as unknown as Response;

    // Simulacion de la funcion next()
    const next = jest.fn() as unknown as NextFunction;

    // Ejecutar el middleware
    requestLogger(req, res, next);

    // Simular que la respuesta ya termino
    finishCallback();

    // Verificar que se imprimio el metodo, la ruta y el codigo 200
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("GET /health -> 200"),
    );

    // Restaurar console.log para no afectar otras pruebas
    consoleSpy.mockRestore();
  });
});
