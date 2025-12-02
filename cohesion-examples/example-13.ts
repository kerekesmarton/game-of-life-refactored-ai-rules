/**
 * Workshop Example 13 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

export class Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: Date;

  constructor(name: string, price: number, stock: number, categoryId: string) {
    this.id = `PROD-${Date.now()}`;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.categoryId = categoryId;
    this.createdAt = new Date();
  }

  // Domain logic
  isInStock(): boolean {
    return this.stock > 0;
  }

  canFulfillOrder(quantity: number): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): boolean {
    if (!this.canFulfillOrder(quantity)) {
      return false;
    }

    this.stock -= quantity;
    console.log(`Stock reduced by ${quantity}. New stock: ${this.stock}`);
    return true;
  }

  calculateDiscount(discountPercent: number): number {
    return this.price * (1 - discountPercent / 100);
  }

  // Database operations (CROSS-LAYER!)
  save(): void {
    console.log("Connecting to database...");
    console.log(`INSERT INTO products VALUES (${this.id}, '${this.name}', ${this.price}, ${this.stock})`);
    console.log("Product saved to database");
  }

  update(): void {
    console.log("Connecting to database...");
    console.log(`UPDATE products SET name='${this.name}', price=${this.price}, stock=${this.stock} WHERE id='${this.id}'`);
    console.log("Product updated in database");
  }

  delete(): void {
    console.log("Connecting to database...");
    console.log(`DELETE FROM products WHERE id='${this.id}'`);
    console.log("Product deleted from database");
  }

  static findById(id: string): Product | null {
    console.log(`SELECT * FROM products WHERE id='${id}'`);
    // Simulate database query
    return new Product("Sample Product", 99.99, 10, "CAT-1");
  }

  static findByCategory(categoryId: string): Product[] {
    console.log(`SELECT * FROM products WHERE category_id='${categoryId}'`);
    // Simulate database query
    return [];
  }

  // Presentation/UI operations (CROSS-LAYER!)
  formatForDisplay(): string {
    return `<div class="product">
      <h2>${this.name}</h2>
      <p class="price">$${this.price.toFixed(2)}</p>
      <p class="stock">${this.stock} in stock</p>
    </div>`;
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
    });
  }

  formatAsCsv(): string {
    return `${this.id},${this.name},${this.price},${this.stock},${this.categoryId}`;
  }

  getStatusBadge(): string {
    if (this.stock === 0) {
      return '<span class="badge-red">Out of Stock</span>';
    } else if (this.stock < 5) {
      return '<span class="badge-yellow">Low Stock</span>';
    } else {
      return '<span class="badge-green">In Stock</span>';
    }
  }

  // API/HTTP operations (CROSS-LAYER!)
  static async fetchFromAPI(apiUrl: string, productId: string): Promise<Product> {
    console.log(`HTTP GET ${apiUrl}/products/${productId}`);
    // Simulate API call
    return new Product("API Product", 49.99, 5, "CAT-2");
  }

  async syncToAPI(apiUrl: string): Promise<void> {
    console.log(`HTTP PUT ${apiUrl}/products/${this.id}`);
    console.log(`Payload: ${this.toJSON()}`);
  }
}

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What layers are being mixed together?
 * 3. What problems does this design create?
 * 4. How would you improve this design?
 *
 * Hint: Look at the different architectural layers this class spans
 */
