/**
 * Workshop Example 03
 * Analyze the cohesion type of this class and suggest improvements
 */

interface OrderData {
  orderId: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  shippingAddress: string;
  timestamp: Date;
}

export class OrderOperations {
  printInvoice(order: OrderData): void {
    // Uses orderId, items, and timestamp
    console.log(`Invoice for Order ${order.orderId}`);
    console.log(`Date: ${order.timestamp.toISOString()}`);

    let total = 0;
    order.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      console.log(`${item.name}: $${item.price} x ${item.quantity} = $${itemTotal}`);
      total += itemTotal;
    });

    console.log(`Total: $${total}`);
  }

  calculateShipping(order: OrderData): number {
    // Uses items and shippingAddress
    const totalWeight = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const isInternational = !order.shippingAddress.includes("USA");

    const baseRate = isInternational ? 25 : 10;
    return baseRate + (totalWeight * 2);
  }

  generateTrackingEmail(order: OrderData): string {
    // Uses orderId, shippingAddress, and timestamp
    return `Your order ${order.orderId} placed on ${order.timestamp.toLocaleDateString()} ` +
           `is being shipped to:\n${order.shippingAddress}\n` +
           `Track your package at: https://tracking.com/${order.orderId}`;
  }

  validateOrder(order: OrderData): boolean {
    // Uses items, orderId, and shippingAddress
    const hasItems = order.items.length > 0;
    const hasValidId = order.orderId.length > 0;
    const hasAddress = order.shippingAddress.length > 10;

    return hasItems && hasValidId && hasAddress;
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
