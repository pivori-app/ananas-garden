// Configuration PayPal (Sandbox pour tests)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === "live" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

/**
 * Obtenir un token d'accès PayPal
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Échec de l'authentification PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

export interface CreatePayPalOrderParams {
  amount: string; // Montant total en euros
  currency?: string; // Devise (EUR par défaut)
  orderId: number; // ID de la commande dans notre base
}

export interface PayPalOrderResponse {
  id: string; // ID de la commande PayPal
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

/**
 * Créer une commande PayPal
 */
export async function createPayPalOrder(
  params: CreatePayPalOrderParams
): Promise<PayPalOrderResponse> {
  try {
    const { amount, currency = "EUR", orderId } = params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `ORDER-${orderId}`,
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: `Commande Ananas Garden #${orderId}`,
          },
        ],
        application_context: {
          brand_name: "Ananas Garden",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[PayPal] Erreur API:", error);
      throw new Error("Échec de la création de la commande PayPal");
    }

    const data = await response.json();
    return {
      id: data.id,
      status: data.status,
      links: data.links || [],
    };
  } catch (error) {
    console.error("[PayPal] Erreur lors de la création de la commande:", error);
    throw new Error("Impossible de créer la commande PayPal");
  }
}

/**
 * Capturer le paiement d'une commande PayPal
 */
export async function capturePayPalOrder(paypalOrderId: string): Promise<{
  id: string;
  status: string;
  payerId?: string;
  payerEmail?: string;
}> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[PayPal] Erreur capture:", error);
      throw new Error("Échec de la capture du paiement PayPal");
    }

    const data = await response.json();
    const payer = data.payer;

    return {
      id: data.id,
      status: data.status,
      payerId: payer?.payer_id,
      payerEmail: payer?.email_address,
    };
  } catch (error) {
    console.error("[PayPal] Erreur lors de la capture du paiement:", error);
    throw new Error("Impossible de capturer le paiement PayPal");
  }
}

/**
 * Récupérer les détails d'une commande PayPal
 */
export async function getPayPalOrderDetails(paypalOrderId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer les détails de la commande PayPal");
    }

    return await response.json();
  } catch (error) {
    console.error("[PayPal] Erreur lors de la récupération des détails:", error);
    throw new Error("Impossible de récupérer les détails de la commande PayPal");
  }
}
