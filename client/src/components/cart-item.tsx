import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@shared/schema";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const removeFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = cart.filter(
      (i: CartItemType) =>
        i.productId !== item.productId ||
        i.color !== item.color ||
        i.pattern !== item.pattern
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${item.product.basePrice.toFixed(2)} × {item.quantity}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeFromCart}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Color:</span> {item.color}
          </p>
          <p>
            <span className="font-medium">Pattern:</span> {item.pattern}
          </p>
          {item.details && (
            <p>
              <span className="font-medium">Special Details:</span> {item.details}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}