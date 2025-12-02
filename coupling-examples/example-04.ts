/**
 * Workshop Example 04 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

interface Order {
  id: string;
  customerId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    lastFourDigits: string;
    expiryDate: string;
  };
  orderDate: Date;
  status: string;
  trackingNumber?: string;
}

// Stamp Coupling - passes entire Order but only uses id
export class OrderTracker {
  getTrackingUrl(order: Order): string {
    // Only uses order.id and order.trackingNumber
    // All other order data (items, addresses, payment, etc.) is unused
    if (order.trackingNumber) {
      return `https://tracking.com/orders/${order.id}?tracking=${order.trackingNumber}`;
    }
    return `Order ${order.id} has no tracking number yet`;
  }
}

// Stamp Coupling - passes entire Order but only uses total
export class InvoiceGenerator {
  generateInvoiceNumber(order: Order): string {
    // Only uses order.id and order.total
    // Doesn't use items, addresses, dates, payment details, etc.
    return `INV-${order.id}-${order.total.toFixed(2)}`;
  }

  formatInvoiceAmount(order: Order): string {
    // Only uses order.total
    return `Total: $${order.total.toFixed(2)}`;
  }
}

// Stamp Coupling - passes entire Order but only uses shipping address
export class ShippingLabelPrinter {
  printLabel(order: Order): string {
    // Only uses order.shippingAddress and order.id
    // Doesn't use items, payment, billing address, dates, etc.
    const addr = order.shippingAddress;
    return `
      Order #${order.id}
      Ship To:
      ${addr.street}
      ${addr.city}, ${addr.state} ${addr.zipCode}
      ${addr.country}
    `;
  }
}

// Stamp Coupling - passes entire Order but only uses items array
export class OrderSummary {
  getItemCount(order: Order): number {
    // Only uses order.items
    // All other order data is unused
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getProductNames(order: Order): string[] {
    // Only uses order.items (specifically item.name)
    return order.items.map((item) => item.name);
  }
}

// Usage showing the problem
const order: Order = {
  id: "ORD-12345",
  customerId: "CUST-789",
  items: [
    { productId: "PROD-1", name: "Widget", price: 29.99, quantity: 2 },
    { productId: "PROD-2", name: "Gadget", price: 49.99, quantity: 1 },
  ],
  subtotal: 109.97,
  tax: 8.8,
  shipping: 10.0,
  total: 128.77,
  shippingAddress: {
    street: "123 Oak St",
    city: "Portland",
    state: "OR",
    zipCode: "97201",
    country: "USA",
  },
  billingAddress: {
    street: "456 Elm St",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    country: "USA",
  },
  paymentMethod: {
    type: "credit_card",
    lastFourDigits: "1234",
    expiryDate: "12/25",
  },
  orderDate: new Date(),
  status: "processing",
  trackingNumber: "TRACK-9876",
};

const tracker = new OrderTracker();
tracker.getTrackingUrl(order); // Passes huge object, uses only id + trackingNumber

const invoiceGen = new InvoiceGenerator();
invoiceGen.generateInvoiceNumber(order); // Passes huge object, uses only id + total

const labelPrinter = new ShippingLabelPrinter();
labelPrinter.printLabel(order); // Passes huge object, uses only shippingAddress

const summary = new OrderSummary();
summary.getItemCount(order); // Passes huge object, uses only items

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. What are the risks of passing such large objects?
 * 3. How much of the Order data does each method actually need?
 * 4. How would you refactor this code to improve coupling?
 *
 * Hint: Each method only needs a small portion of the Order object
 */
