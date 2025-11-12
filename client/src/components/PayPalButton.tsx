import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PayPalButtonProps {
  orderId: number;
  amount: string;
  currency?: string;
  onSuccess: (paypalOrderId: string) => void;
  onError?: (error: any) => void;
}

export default function PayPalButton({
  orderId,
  amount,
  currency = "EUR",
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const createPayPalOrder = trpc.paypal.createOrder.useMutation();
  const capturePayPalOrder = trpc.paypal.captureOrder.useMutation();

  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Configuration PayPal manquante. Veuillez configurer VITE_PAYPAL_CLIENT_ID.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: currency,
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const result = await createPayPalOrder.mutateAsync({
              orderId,
              amount,
              currency,
            });

            if (!result || !result.id) {
              throw new Error("Échec de la création de la commande PayPal");
            }

            return result.id;
          } catch (error: any) {
            console.error("Erreur lors de la création de la commande PayPal:", error);
            toast.error(error.message || "Erreur lors de la création de la commande PayPal");
            throw error;
          }
        }}
        onApprove={async (data) => {
          try {
            const result = await capturePayPalOrder.mutateAsync({
              paypalOrderId: data.orderID,
              orderId,
            });

            if (result.status === "COMPLETED") {
              toast.success("Paiement réussi !");
              onSuccess(data.orderID);
            } else {
              throw new Error("Le paiement n'a pas été complété");
            }
          } catch (error: any) {
            console.error("Erreur lors de la capture du paiement:", error);
            toast.error(error.message || "Erreur lors du paiement");
            if (onError) onError(error);
          }
        }}
        onError={(err) => {
          console.error("Erreur PayPal:", err);
          toast.error("Une erreur est survenue avec PayPal");
          if (onError) onError(err);
        }}
        onCancel={() => {
          toast.info("Paiement annulé");
        }}
      />
    </PayPalScriptProvider>
  );
}
