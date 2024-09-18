import { useEffect, useState } from "react";
import { useAppSelector } from "../slices/store";

export default function SeamlessCheckout() {
  const [checkoutView, setCheckoutView] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const incomingPaymentOrder = useAppSelector(
    (state) => state.paymentSlice.paymentOrderIncoming
  );

  useEffect(() => {
    if (incomingPaymentOrder) {
      const operation = incomingPaymentOrder.operations.find(
        (o) => o.rel === "view-checkout"
      );

      if (operation) {
        setCheckoutView(operation.href);
      }
    }
  }, [incomingPaymentOrder]);

  useEffect(() => {
    if (checkoutView && !isInitialized) {
      const script = document.createElement("script");
      script.src = checkoutView;
      script.onload = () => {
        if (typeof payex !== "undefined" && payex.hostedView) {
          const checkout = payex.hostedView.checkout({
            container: {
              checkout: "checkout-container",
            },
            culture: "sv-SE",
          });

          checkout.open();
        } else {
          console.error("Payex library not loaded");
        }
      };
      script.onerror = () => {
        console.error("Failed to load checkout script");
      };

      document.head.appendChild(script);
      setIsInitialized(true);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [checkoutView, isInitialized, incomingPaymentOrder]);

  return (
    <div
      id="checkout-container"
      style={{ minHeight: "400px", width: "100%", backgroundColor: "#f5f5f5" }}
    >
      {/* Checkout-vyn kommer att laddas här */}
    </div>
  );
}
