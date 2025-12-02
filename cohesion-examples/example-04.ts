/**
 * Workshop Example 04
 * Analyze the cohesion type of this class and suggest improvements
 */

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export class ProductManager {
  private database: Map<string, Product> = new Map();

  createProduct(name: string, price: number, stock: number): Product {
    const id = `PROD-${Date.now()}`;
    const product: Product = { id, name, price, stock };

    console.log(`Creating product in database: ${id}`);
    this.database.set(id, product);

    console.log("Updating inventory system");
    console.log("Notifying warehouse");

    return product;
  }

  readProduct(id: string): Product | null {
    console.log(`Reading product from database: ${id}`);
    const product = this.database.get(id);

    if (product) {
      console.log("Logging access for analytics");
      return product;
    }

    return null;
  }

  updateProduct(id: string, updates: Partial<Product>): boolean {
    console.log(`Updating product in database: ${id}`);
    const product = this.database.get(id);

    if (!product) {
      return false;
    }

    Object.assign(product, updates);
    this.database.set(id, product);

    console.log("Invalidating cache");
    console.log("Triggering reindex");

    return true;
  }

  deleteProduct(id: string): boolean {
    console.log(`Deleting product from database: ${id}`);

    if (!this.database.has(id)) {
      return false;
    }

    this.database.delete(id);

    console.log("Archiving product data");
    console.log("Updating search index");

    return true;
  }

  listAllProducts(): Product[] {
    console.log("Querying all products from database");
    return Array.from(this.database.values());
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
