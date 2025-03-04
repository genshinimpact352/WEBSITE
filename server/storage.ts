import { 
  type Product, 
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { PRODUCTS } from "@shared/constants";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderCounter: number;

  constructor() {
    this.products = new Map(PRODUCTS.map((p: Product) => [p.id, p]));
    this.orders = new Map();
    this.orderCounter = 1;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const newOrder = { ...order, id } as Order;
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();