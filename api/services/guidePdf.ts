import type { Guide } from "../models/types.js";

/**
 * Minimal PDF generator (no external deps).
 * Produces a single-page PDF document with the guide summary.
 *
 * Character escaping: PDF text uses parentheses as delimiters, so backslashes
 * and parentheses inside the content must be escaped to keep the stream valid.
 */
function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function generateGuidePdf(guide: Guide): Buffer {
  const lines: string[] = [
    `MultiEnviosGT - Guia de Envio`,
    ``,
    `Numero de guia: ${guide.trackingNumber}`,
    `Courier: ${guide.courier}`,
    `Estado: ${guide.status}`,
    `Costo: Q${guide.cost.toFixed(2)}`,
    `Fecha: ${guide.createdAt}`,
    ``,
    `Destinatario`,
    `  Nombre: ${guide.recipient.name}`,
    `  Telefono: ${guide.recipient.phone}`,
    `  Departamento: ${guide.recipient.department}`,
    `  Municipio: ${guide.recipient.municipality}`,
    `  Direccion: ${guide.recipient.address}`,
    `  Referencia: ${guide.recipient.reference ?? "-"}`,
    ``,
    `Pedido`,
    `  Descripcion: ${guide.parcel.description}`,
    `  Cantidad: ${guide.parcel.quantity}`,
    `  Valor contra entrega: Q${guide.parcel.codAmount.toFixed(2)}`,
    `  Peso: ${guide.parcel.weight} kg`,
    `  Tipo de envio: ${guide.parcel.type}`,
  ];

  const fontSize = 12;
  const lineHeight = fontSize * 1.5;
  const startY = 780;
  const leftMargin = 50;
  const pageHeight = 842;
  const pageWidth = 595;

  const contentLines: string[] = [];
  lines.forEach((line, index) => {
    const y = startY - index * lineHeight;
    contentLines.push(
      `BT /F1 ${fontSize} Tf ${leftMargin} ${y} Td (${escapePdfText(line)}) Tj ET`,
    );
  });

  const stream = `1 0 0 1 0 0 cm\n${contentLines.join("\n")}\n`;

  // Build PDF objects.
  // 1: Catalog, 2: Pages, 3: Page, 4: Font, 5: Content stream.
  const objects: string[] = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}