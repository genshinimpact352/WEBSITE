import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="mb-2">{product.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4">
          {product.description}
        </p>
        <p className="text-lg font-bold">${product.basePrice.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/product/${product.id}`}>
          <Button className="w-full">Customize & Order</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
