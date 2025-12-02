/**
 * Workshop Example 10 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Content/Pathological Coupling - exposed internals
export class ShoppingCart {
  items: Array<{ productId: string; name: string; price: number; quantity: number }>; // Public!
  subtotal: number; // Public!
  taxRate: number; // Public!
  discountCode: string | null; // Public!
  discountAmount: number; // Public!

  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.taxRate = 0.08;
    this.discountCode = null;
    this.discountAmount = 0;
  }

  // No proper encapsulation
}

// Content Coupling - directly manipulates cart internals
export class CartManager {
  addItem(
    cart: ShoppingCart,
    productId: string,
    name: string,
    price: number,
    quantity: number
  ): void {
    // Directly manipulates internal array
    cart.items.push({ productId, name, price, quantity });

    // Directly recalculates and modifies internal fields
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    console.log(`Added ${name} to cart. Subtotal: $${cart.subtotal}`);
  }

  removeItem(cart: ShoppingCart, productId: string): void {
    // Directly manipulates internal array
    const index = cart.items.findIndex((item) => item.productId === productId);
    if (index !== -1) {
      cart.items.splice(index, 1);

      // Directly recalculates subtotal
      cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
  }

  updateQuantity(cart: ShoppingCart, productId: string, newQuantity: number): void {
    // Directly finds and modifies item in internal array
    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = newQuantity; // Direct field manipulation!

      // Directly recalculates subtotal
      cart.subtotal = cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    }
  }
}

// Content Coupling - manipulates pricing internals
export class PricingService {
  applyDiscount(cart: ShoppingCart, discountCode: string): void {
    // Directly modifies internal discount fields
    cart.discountCode = discountCode;

    // Directly calculates and modifies discount amount
    if (discountCode === "SAVE10") {
      cart.discountAmount = cart.subtotal * 0.1;
    } else if (discountCode === "SAVE20") {
      cart.discountAmount = cart.subtotal * 0.2;
    } else {
      cart.discountAmount = 0;
    }

    console.log(`Discount applied: $${cart.discountAmount}`);
  }

  changeTaxRate(cart: ShoppingCart, newRate: number): void {
    // Directly modifies tax rate
    cart.taxRate = newRate;
    console.log(`Tax rate changed to ${newRate * 100}%`);
  }

  calculateTotal(cart: ShoppingCart): number {
    // Directly accesses all internal fields to calculate
    const afterDiscount = cart.subtotal - cart.discountAmount;
    const tax = afterDiscount * cart.taxRate;
    return afterDiscount + tax;
  }
}

// Content Coupling - inventory manager reaches into cart
export class InventoryManager {
  checkStockAvailability(cart: ShoppingCart): boolean {
    // Directly accesses internal items array
    for (const item of cart.items) {
      console.log(`Checking stock for ${item.name}: ${item.quantity} units`);

      // Simulated stock check
      const availableStock = 100;
      if (item.quantity > availableStock) {
        // Directly modifies item quantity!
        item.quantity = availableStock;
        console.log(`Adjusted quantity to available stock: ${availableStock}`);

        // Directly recalculates subtotal
        cart.subtotal = cart.items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
      }
    }

    return true;
  }

  reserveItems(cart: ShoppingCart): void {
    // Directly accesses internal items
    for (const item of cart.items) {
      console.log(`Reserving ${item.quantity}x ${item.name}`);
    }
  }
}

// Content Coupling - order processor manipulates cart
export class OrderProcessor {
  checkout(cart: ShoppingCart, userId: string): void {
    console.log(`Processing checkout for user ${userId}`);

    // Directly accesses all cart internals
    console.log(`Items: ${cart.items.length}`);
    console.log(`Subtotal: $${cart.subtotal}`);
    console.log(`Discount: $${cart.discountAmount}`);
    console.log(`Tax Rate: ${cart.taxRate * 100}%`);

    // Directly manipulates cart to clear it
    cart.items = [];
    cart.subtotal = 0;
    cart.discountCode = null;
    cart.discountAmount = 0;

    console.log("Cart cleared after checkout");
  }

  validateCart(cart: ShoppingCart): boolean {
    // Directly accesses and validates internal fields
    if (cart.items.length === 0) {
      console.log("Cart is empty");
      return false;
    }

    if (cart.subtotal < 0) {
      // Fix invalid state by directly modifying
      cart.subtotal = 0;
      console.log("Fixed negative subtotal");
    }

    if (cart.discountAmount > cart.subtotal) {
      // Fix invalid state by directly modifying
      cart.discountAmount = cart.subtotal;
      console.log("Fixed excessive discount");
    }

    return true;
  }
}

// Usage showing the problem
const cart = new ShoppingCart();

const cartManager = new CartManager();
cartManager.addItem(cart, "PROD-1", "Widget", 29.99, 2);
cartManager.addItem(cart, "PROD-2", "Gadget", 49.99, 1);

const pricingService = new PricingService();
pricingService.applyDiscount(cart, "SAVE10");

const inventoryManager = new InventoryManager();
inventoryManager.checkStockAvailability(cart);

// The problem: Cart internals are completely exposed!
cart.items[0].price = 0.01; // Can modify prices directly!
cart.subtotal = 9999999; // Can set any value!
cart.discountAmount = cart.subtotal * 2; // Can make discount exceed subtotal!
cart.taxRate = -0.5; // Can set negative tax rate!

console.log(`"Total": $${cart.subtotal}`); // Data integrity is lost!

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. How many classes directly manipulate ShoppingCart's internals?
 * 3. What are the dangers of exposing internal state?
 * 4. How would you refactor to proper encapsulation?
 *
 * Hint: Think about making fields private and providing methods that maintain invariants
 */
