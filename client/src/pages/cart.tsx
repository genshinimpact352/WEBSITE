import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartItemComponent from "@/components/cart-item";
import { useToast } from "@/hooks/use-toast";
import { DISCOUNT_CODES } from "@shared/constants";
import { CartItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const createOrder = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return res.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="w-full mt-4">
        Pay Now
      </Button>
    </form>
  );
}

export default function Cart() {
  const [discountCode, setDiscountCode] = useState("");
  const { toast } = useToast();
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  );

  const discount = DISCOUNT_CODES[discountCode as keyof typeof DISCOUNT_CODES] || 0;
  const total = Math.max(subtotal - discount, 0);

  const createPaymentIntent = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
      });
      return res.json();
    },
  });

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground mt-2">
          Add some items to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        {cart.map((item, index) => (
          <CartItemComponent key={index} item={item} />
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              if (DISCOUNT_CODES[discountCode as keyof typeof DISCOUNT_CODES]) {
                toast({
                  title: "Discount applied!",
                  description: `$${DISCOUNT_CODES[discountCode as keyof typeof DISCOUNT_CODES]} off your order.`,
                });
              } else {
                toast({
                  title: "Invalid code",
                  description: "This discount code is not valid.",
                  variant: "destructive",
                });
              }
            }}
          >
            Apply
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Use code "WELCOME1" for $1 off your order!
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: createPaymentIntent.data?.clientSecret,
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}