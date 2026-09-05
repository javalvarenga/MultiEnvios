import { test, describe, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

import { createGuide } from "../services/guideService.js";
import * as Caex from "../controllers/Shipping/Caex.js";
import { settingsRepository } from "../repositories/SettingsRepository.js";
import { log, getLogs, clearLogs } from "../services/logManager.js";

/**
 * Pruebas de generacion de guias de Cargo Expreso.
 *
 * No se usan credenciales reales: la configuracion del courier se carga en
 * memoria desde el SettingsRepository y la llamada HTTP a CAEX se intercepta
 * mockeando `axios.post`. Ademas se valida que el modulo de logging basado en
 * archivo registre al menos una entrada tras la ejecucion.
 */

describe("guideService + logManager", () => {
  before(async () => {
    // Limpia el archivo de logs para partir de un estado conocido.
    await clearLogs();

    // Carga una configuracion simulada de CAEX en el repositorio en memoria.
    settingsRepository.upsert({
      courier: "caex",
      isEnabled: true,
      config: {
        user: "MOCK_USER",
        password: "MOCK_PASSWORD",
        originTown: "0001",
        originAddress: "Direccion mock",
        originPhone: "00000000",
        sender: "Remitente Mock",
        creditCode: "MOCK_CREDIT",
        printFormat: "1",
        host: "http://mock-caex.local",
        soapActionGenerateGuide: "http://mock/GenerarGuia",
        soapActionCancelGuide: "http://mock/AnularGuia",
      },
    });
  });

  after(async () => {
    mock.restoreAll();
  });

  test("createGuide genera una guia local sin lanzar errores", async () => {
    const guide = createGuide("u1", {
      courier: "cargo_expreso",
      recipient: {
        name: "Cliente Prueba",
        phone: "5555-5555",
        department: "Guatemala",
        municipality: "Guatemala",
        address: "Zona 1, calle mock",
        reference: "frente al parque",
      },
      parcel: {
        description: "Paquete de prueba",
        quantity: 1,
        codAmount: 100,
        weight: 1.5,
        type: "package",
      },
    });

    assert.ok(guide.id, "la guia debe tener un id");
    assert.equal(guide.courier, "cargo_expreso");
    assert.ok(guide.trackingNumber.startsWith("CE-"), "el tracking debe usar el prefijo CE");
    assert.ok(guide.pdf.length > 0, "debe generar un PDF");

    await log(`Guia local creada: ${guide.trackingNumber} (id=${guide.id})`);
  });

  test("Caex.createGuide no lanza errores con credenciales simuladas", async () => {
    // Respuesta SOAP simulada que la API de CAEX devolveria al generar la guia.
    const fakeSoapResponse = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GenerarGuiaResponse xmlns="http://www.caexlogistics.com/ServiceBus">
            <ResultadoGenerarGuia>
              <ResultadoOperacionMultiple>
                <ResultadoExitoso>true</ResultadoExitoso>
              </ResultadoOperacionMultiple>
              <ListaRecolecciones>
                <DatosRecoleccion>
                  <NumeroGuia>12345678</NumeroGuia>
                </DatosRecoleccion>
              </ListaRecolecciones>
            </ResultadoGenerarGuia>
          </GenerarGuiaResponse>
        </soap:Body>
      </soap:Envelope>`;

    const postMock = mock.method(axios, "post", async () => ({
      data: fakeSoapResponse,
    }));

    const details = {
      orderId: "order-mock-1",
      customerName: "Cliente CAEX Mock",
      adressDescription: "Direccion mock destino",
      phoneNumber: "5555-1234",
      townCode: "0001",
      userCode: "USER1",
      totalToPay: 250,
      sendNote: true,
      note: "Entregar en horario diurno",
    };

    const result = await Caex.createGuide(details);

    assert.equal(postMock.mock.calls.length, 1, "axios.post debe llamarse una vez");
    assert.equal(result.generateGuide, "12345678", "debe devolver el numero de guia simulado");

    await log(`Guia CAEX generada (mock): ${result.generateGuide}`);
  });

  test("se registra al menos una entrada en logs.txt", async () => {
    const content = await getLogs();
    assert.ok(content.length > 0, "logs.txt no debe estar vacio");

    const lines = content.split("\n").filter((line) => line.trim().length > 0);
    assert.ok(lines.length >= 1, "debe haber al menos una linea de log");
  });
});