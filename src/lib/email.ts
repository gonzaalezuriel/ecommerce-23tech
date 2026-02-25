/**
 * Servicio de envío de emails transaccionales (Resend).
 * Genera y envía emails HTML de confirmación de compra con
 * detalles del pedido, dirección de envío y resumen de productos.
 * Si RESEND_API_KEY no está configurada, los emails fallan silenciosamente.
 */
import { Resend } from "resend"
import { formatPrice } from "@/lib/utils"

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_to_prevent_crash")

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
interface OrderEmailData {
  to: string
  userName: string
  orderId: string
  items: Array<{
    brand: string
    model: string
    quantity: number
    unitPrice: number
  }>
  total: number
  address: string
  phone: string
}


export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  // Si no hay API key configurada, solo logueamos (entorno de desarrollo)
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Confirmación de orden (sin RESEND_API_KEY):", {
      to: data.to,
      orderId: data.orderId,
      total: data.total,
    })
    return { success: true }
  }

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937;">
          <strong>${escapeHtml(item.brand)}</strong> ${escapeHtml(item.model)}
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Cant: ${item.quantity} x ${formatPrice(item.unitPrice)}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">
          ${formatPrice(item.unitPrice * item.quantity)}
        </td>
      </tr>`
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de compra</title>
      <style>
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background: #f9fafb; }
        table { border-collapse: collapse; width: 100%; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); width: 100%; }
        .header { background: #0f172a; padding: 24px; text-align: center; }
        .content { padding: 20px; }
        @media only screen and (max-width: 600px) {
          .content { padding: 15px; }
          body { padding: 10px; }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div class="container">
        
        <div class="header">
          <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">23Tech</h1>
          <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Confirmación de compra</p>
        </div>

        <div class="content">
          <p style="color: #374151; font-size: 16px; margin-top: 0;">Hola <strong>${escapeHtml(data.userName)}</strong>,</p>
          <p style="color: #374151; font-size: 15px;">Tu compra fue registrada exitosamente. Aquí está el resumen:</p>

          <div style="background: #f3f4f6; border-radius: 6px; padding: 12px 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">N° de orden</p>
            <p style="margin: 4px 0 0; font-family: monospace; font-size: 16px; font-weight: 700; color: #111827;">#${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <table style="width: 100%; margin: 20px 0;">
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align: right; padding: 16px 0; border-top: 2px solid #e5e7eb;">
            <span style="font-size: 20px; font-weight: 700; color: #0f172a;">Total: ${formatPrice(data.total)}</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #475569; text-transform: uppercase;">Detalles de envío</p>
            <p style="margin: 8px 0 0; color: #1e293b; font-size: 15px; line-height: 1.5;">${escapeHtml(data.address)}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">📞 ${escapeHtml(data.phone)}</p>
          </div>

          <p style="color: #64748b; font-size: 14px; margin-top: 32px; text-align: center;">Gracias por confiar en 23Tech.<br>Nos pondremos en contacto a la brevedad.</p>
        </div>

        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">© 2025 23Tech. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: "23Tech <noreply@23tech.site>",
      to: data.to,
      subject: `Confirmación de compra #${data.orderId.slice(0, 8).toUpperCase()} – 23Tech`,
      html,
    })
    console.log("[EMAIL] Enviado exitosamente:", { to: data.to, result })
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error al enviar confirmación:", error)
    // No bloqueamos el checkout si el email falla
    return { success: true }
  }
}
