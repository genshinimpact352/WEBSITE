import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, customizationSchema, type CustomizationForm } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
  });

  const form = useForm<CustomizationForm>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      color: "",
      pattern: "",
      details: "",
      quantity: 1,
    },
  });

  if (isLoading || !product) {
    return <div className="h-64 bg-muted rounded-lg animate-pulse" />;
  }

  const onSubmit = (data: CustomizationForm) => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Add new item
    cart.push({
      productId: product.id,
      product,
      ...data,
    });
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    toast({
      title: "Added to cart!",
      description: "Your customized item has been added to the cart.",
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mt-2">
            ${product.basePrice.toFixed(2)}
          </p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Baby Blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Striped" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add to Cart
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
