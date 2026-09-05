import axios from "axios";
import * as xmlJs from "xml-js";
import { assignGuides } from "../Orders.js";
import { getIntegrationRaw } from "../../repositories/SettingsRepository.js";

// Fallback a variables de entorno (compatibilidad con despliegues previos a
// la tabla IntegrationSettings).
const ENV_CAEX_CONFIG = {
  user: process.env.CAEX_USER,
  password: process.env.CAEX_PASSWORD,
  originTown: process.env.ORIGIN_TOWN,
  originAddress: process.env.ORIGIN_ADDRESS,
  originPhone: process.env.ORIGIN_PHONE,
  sender: process.env.SENDER,
  creditCode: process.env.CAEX_CREDIT_CODE,
  printFormat: process.env.CAEX_PRINT_FORMAT,
  host: process.env.CAEX_HOST,
  soapActionGenerateGuide: process.env.SOAP_ACTION_GENERATE_GUIDE,
  soapActionCancelGuide: process.env.SOAP_ACTION_CANCEL_GUIDE,
};

export class CaexDisabledError extends Error {
  constructor(message?: string) {
    super(message || "La integracion con Cargo Expreso esta desactivada.");
    this.name = "CaexDisabledError";
    (this as unknown as { code: string }).code = "INTEGRATION_DISABLED";
  }
}

interface CaexConfig {
  user?: string;
  password?: string;
  originTown?: string;
  originAddress?: string;
  originPhone?: string;
  sender?: string;
  creditCode?: string;
  printFormat?: string;
  host?: string;
  soapActionGenerateGuide?: string;
  soapActionCancelGuide?: string;
}

/**
 * Resuelve la configuracion de CAEX: prioriza IntegrationSettings del tenant y
 * cae a las variables de entorno cuando no hay fila o campos faltantes.
 */
export const resolveCaexConfig = async (
  tenantSchema?: string,
): Promise<CaexConfig> => {
  const integration = getIntegrationRaw("caex", tenantSchema);

  // Si existe la fila y esta explicitamente desactivada, bloquear.
  if (integration && integration.isEnabled === false) {
    throw new CaexDisabledError();
  }

  const dbConfig: Record<string, string> = integration?.config ?? {};
  const pick = (key: keyof typeof ENV_CAEX_CONFIG): string | undefined => {
    const value = dbConfig[key];
    if (value !== undefined && value !== null && value !== "") return value;
    return ENV_CAEX_CONFIG[key];
  };

  return {
    user: pick("user"),
    password: pick("password"),
    originTown: pick("originTown"),
    originAddress: pick("originAddress"),
    originPhone: pick("originPhone"),
    sender: pick("sender"),
    creditCode: pick("creditCode"),
    printFormat: pick("printFormat"),
    host: pick("host"),
    soapActionGenerateGuide: pick("soapActionGenerateGuide"),
    soapActionCancelGuide: pick("soapActionCancelGuide"),
  };
};

interface GuideDetails {
  orderId: string;
  customerName: string;
  adressDescription?: string;
  phoneNumber: string;
  phoneNumber2?: string;
  townCode: string;
  userCode?: string;
  totalToPay: number;
  sendNote?: boolean;
  note?: string;
}

const generateGuideXML = (
  orderId: string,
  customerName: string,
  adressDescription: string | undefined,
  phoneNumber: string,
  phoneNumber2: string,
  townCode: string,
  userCode: string,
  totalToPay: number,
  sendNote: boolean,
  note: string | undefined,
  config: CaexConfig,
): string => {
  const {
    user: CAEX_USER,
    password: CAEX_PASSWORD,
    originTown: ORIGIN_TOWN,
    originAddress: ORIGIN_ADDRESS,
    originPhone: ORIGIN_PHONE,
    sender: SENDER,
    creditCode: CAEX_CREDIT_CODE,
    printFormat: CAEX_PRINT_FORMAT,
  } = config;
  const typeOfService = totalToPay > 0 ? 3 : 1;
  const townCodeWithZero = String(townCode).padStart(4, "0");

  return `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GenerarGuia xmlns="http://www.caexlogistics.com/ServiceBus">
        <Autenticacion>
          <Login>${CAEX_USER}</Login>
          <Password>${CAEX_PASSWORD}</Password>
        </Autenticacion>
        <ListaRecolecciones>
          <DatosRecoleccion>
            <RecoleccionID>${orderId}</RecoleccionID>
            <RemitenteNombre>${SENDER}</RemitenteNombre>
            <RemitenteDireccion>${ORIGIN_ADDRESS}</RemitenteDireccion>
            <RemitenteTelefono>${ORIGIN_PHONE}</RemitenteTelefono>
            <DestinatarioNombre>${customerName}</DestinatarioNombre>
            <DestinatarioDireccion>${adressDescription}</DestinatarioDireccion>
            <DestinatarioTelefono>${phoneNumber}</DestinatarioTelefono>
            <DestinatarioContacto>${customerName}</DestinatarioContacto>
            <DestinatarioNIT>CF</DestinatarioNIT>
            <ReferenciaCliente1>${
              phoneNumber2
                ? phoneNumber2
                : typeOfService == 3
                ? "Q" + totalToPay
                : "URGENTE"
            }</ReferenciaCliente1>
            <ReferenciaCliente2>${userCode}-${orderId}</ReferenciaCliente2>
            <CodigoPobladoDestino>${townCodeWithZero}</CodigoPobladoDestino>
            <CodigoPobladoOrigen>${ORIGIN_TOWN}</CodigoPobladoOrigen>
            <TipoServicio>${typeOfService}</TipoServicio>
            <MontoCOD>${totalToPay}</MontoCOD>
            <CodigoCredito>${CAEX_CREDIT_CODE}</CodigoCredito>
            <FormatoImpresion>${CAEX_PRINT_FORMAT}</FormatoImpresion>
            <MontoAsegurado>0.00</MontoAsegurado>
            <Observaciones>${sendNote ? note : ""}</Observaciones>
            <CodigoReferencia>1</CodigoReferencia>
            <TipoEntrega>1</TipoEntrega>
            <Piezas>
              <Pieza>
                <NumeroPieza>1</NumeroPieza>
                 <TipoPieza>2</TipoPieza>
                 <PesoPieza>1</PesoPieza>
                 <MontoCOD>${totalToPay}</MontoCOD>
               </Pieza>
            </Piezas>
          </DatosRecoleccion>
        </ListaRecolecciones>
      </GenerarGuia>
    </soap:Body>
  </soap:Envelope>`;
};

const generateCancelGuideXML = (
  guideId: string,
  config: CaexConfig,
): string => {
  const {
    user: CAEX_USER,
    password: CAEX_PASSWORD,
    creditCode: CAEX_CREDIT_CODE,
  } = config;
  return `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <AnularGuia_Def xmlns="http://www.caexlogistics.com/ServiceBus">
        <Autenticacion>
          <Login>${CAEX_USER}</Login>
          <Password>${CAEX_PASSWORD}</Password>
        </Autenticacion>
        <NumeroGuia>${guideId}</NumeroGuia>
            <CodigoCredito>${CAEX_CREDIT_CODE}</CodigoCredito>
      </AnularGuia_Def>
    </soap12:Body>
  </soap12:Envelope>`;
};

export const createGuide = async (
  details: GuideDetails,
  tenantSchema?: string,
): Promise<{ result: unknown; generateGuide: string }> => {
  const config = await resolveCaexConfig(tenantSchema);
  const xmlContent = generateGuideXML(
    details.orderId,
    details.customerName,
    details?.adressDescription,
    details.phoneNumber,
    details?.phoneNumber2 ?? "",
    details.townCode,
    details.userCode ?? "",
    details.totalToPay,
    Boolean(details.sendNote),
    details?.note,
    config,
  );

  const typeOfService = details?.totalToPay > 0 ? 3 : 1;

  try {
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: config.soapActionGenerateGuide,
    };

    const response = await axios.post(config.host ?? "", xmlContent, {
      headers,
    });

    const responseData = await response.data;
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const jsonData = xmlJs.xml2json(responseData, options);
    const result =
      JSON.parse(jsonData)["soap:Envelope"]["soap:Body"]["GenerarGuiaResponse"][
        "ResultadoGenerarGuia"
      ]["ResultadoOperacionMultiple"]["ResultadoExitoso"];

    const generateGuide =
      JSON.parse(jsonData)["soap:Envelope"]["soap:Body"]["GenerarGuiaResponse"][
        "ResultadoGenerarGuia"
      ]["ListaRecolecciones"]["DatosRecoleccion"]["NumeroGuia"]._text;

    if (result._text == false || !generateGuide) {
      throw new Error("La respuesta no tiene la estructura esperada");
    }

    await assignGuides(
      "CALL CT_Orders_AssignGuides(?)",
      [details?.orderId, generateGuide, typeOfService],
      tenantSchema,
    );
    return { result, generateGuide };
  } catch (error) {
    console.log("error", error);
    throw new Error();
  }
};

export const cancelGuide = async (
  details: { guideId: string; orderId: string },
  tenantSchema?: string,
): Promise<{ success: boolean }> => {
  const config = await resolveCaexConfig(tenantSchema);
  const xmlContent = generateCancelGuideXML(details.guideId, config);

  try {
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: config.soapActionCancelGuide,
    };

    const executeRequest = async (): Promise<boolean> => {
      try {
        const response = await axios.post(config.host ?? "", xmlContent, {
          headers,
        });

        const responseData = await response.data;
        const options = { compact: true, ignoreComment: true, spaces: 4 };
        const jsonData = xmlJs.xml2json(responseData, options);
        const result =
          JSON.parse(jsonData)["soap:Envelope"]["soap:Body"][
            "AnularGuia_DefResponse"
          ]["AnularGuia"]["ResultadoOperacion"]["Resultado"]["_text"];

        return result === "true"; // Retorna true si fue exitoso, false si fallo
      } catch (error) {
        console.error("Error en la peticion a Caex:", error);
        return false;
      }
    };

    let success = await executeRequest();

    if (!success) {
      success = await executeRequest();
    }

    if (!success) {
      return { success: false };
    }

    await assignGuides(
      "CALL CT_Orders_AssignGuides(?)",
      [details?.orderId, "", 0],
      tenantSchema,
    );

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};