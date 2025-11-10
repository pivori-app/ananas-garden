import { ENV } from "./_core/env";

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: number;
  totalPrice: number;
  items: Array<{
    bouquetName: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
  deliveryDate?: Date | null;
}

/**
 * Envoie un email de confirmation de commande
 * Utilise l'API de notification Manus intégrée
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const emailContent = generateOrderEmailHTML(data);

    // Utiliser l'API Forge pour envoyer l'email
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `🌸 Confirmation de votre commande #${data.orderId} - Ananas Garden`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send confirmation email:", await response.text());
      return false;
    }

    console.log(`[Email] Confirmation sent to ${data.customerEmail} for order #${data.orderId}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending confirmation:", error);
    return false;
  }
}

function generateOrderEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.bouquetName}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${(item.price / 100).toFixed(2)} €
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #86efac 0%, #fda4af 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-family: 'Playfair Display', serif;">
                🌸 Ananas Garden
              </h1>
              <p style="margin: 8px 0 0; color: #ffffff; font-size: 14px;">
                Le langage des fleurs réinventé
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #16a34a; font-size: 24px;">
                Merci pour votre commande !
              </h2>
              <p style="margin: 0 0 24px; color: #6b7280; line-height: 1.6;">
                Bonjour <strong>${data.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px; color: #6b7280; line-height: 1.6;">
                Nous avons bien reçu votre commande <strong>#${data.orderId}</strong> et nous vous remercions de votre confiance. Votre bouquet personnalisé sera préparé avec soin par nos artisans fleuristes.
              </p>

              <!-- Order Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px;">
                  Détails de votre commande
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600;">Bouquet</th>
                      <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600;">Quantité</th>
                      <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600;">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                    <tr>
                      <td colspan="2" style="padding: 16px 12px 12px; text-align: right; font-weight: 600; color: #111827;">
                        Total
                      </td>
                      <td style="padding: 16px 12px 12px; text-align: right; font-weight: 700; color: #16a34a; font-size: 18px;">
                        ${(data.totalPrice / 100).toFixed(2)} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Delivery Info -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin-bottom: 24px;">
                <h4 style="margin: 0 0 8px; color: #16a34a; font-size: 16px;">
                  📍 Adresse de livraison
                </h4>
                <p style="margin: 0; color: #6b7280;">
                  ${data.deliveryAddress}
                </p>
                ${
                  data.deliveryDate
                    ? `
                <p style="margin: 8px 0 0; color: #6b7280;">
                  <strong>Date souhaitée :</strong> ${new Date(data.deliveryDate).toLocaleDateString("fr-FR")}
                </p>
                `
                    : ""
                }
              </div>

              <p style="margin: 0 0 16px; color: #6b7280; line-height: 1.6;">
                Vous recevrez un email de confirmation lorsque votre commande sera en cours de préparation, puis un second email avec le numéro de suivi lors de l'expédition.
              </p>

              <p style="margin: 0 0 24px; color: #6b7280; line-height: 1.6;">
                Si vous avez des questions, n'hésitez pas à nous contacter.
              </p>

              <div style="text-align: center; margin-top: 32px;">
                <a href="https://ananas-garden.manus.space" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600;">
                  Voir ma commande
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Ananas Garden - Le langage des fleurs réinventé
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2025 Ananas Garden. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
