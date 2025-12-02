/**
 * Workshop Example 05
 * Analyze the cohesion type of this class and suggest improvements
 */

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface PaymentInfo {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export class CheckoutService {
  private inventoryDb: Map<string, number> = new Map();
  private orderDb: Map<string, any> = new Map();

  processCheckout(
    userId: string,
    items: CartItem[],
    payment: PaymentInfo
  ): string | null {
    // Step 1: Validate inventory
    console.log("Step 1: Checking inventory availability");
    for (const item of items) {
      const available = this.inventoryDb.get(item.productId) || 0;
      if (available < item.quantity) {
        console.log(`Insufficient stock for ${item.productId}`);
        return null;
      }
    }

    // Step 2: Reserve inventory
    console.log("Step 2: Reserving inventory");
    for (const item of items) {
      const current = this.inventoryDb.get(item.productId) || 0;
      this.inventoryDb.set(item.productId, current - item.quantity);
    }

    // Step 3: Process payment
    console.log("Step 3: Processing payment");
    const paymentSuccess = this.chargeCard(payment, this.calculateTotal(items));
    if (!paymentSuccess) {
      console.log("Payment failed, rolling back inventory");
      this.rollbackInventory(items);
      return null;
    }

    // Step 4: Create order
    console.log("Step 4: Creating order record");
    const orderId = `ORD-${Date.now()}`;
    this.orderDb.set(orderId, { userId, items, status: "confirmed" });

    // Step 5: Send confirmation
    console.log("Step 5: Sending confirmation email");
    this.sendConfirmationEmail(userId, orderId);

    return orderId;
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private chargeCard(payment: PaymentInfo, amount: number): boolean {
    console.log(`Charging card ending in ${payment.cardNumber.slice(-4)}: $${amount}`);
    return true;
  }

  private rollbackInventory(items: CartItem[]): void {
    for (const item of items) {
      const current = this.inventoryDb.get(item.productId) || 0;
      this.inventoryDb.set(item.productId, current + item.quantity);
    }
  }

  private sendConfirmationEmail(userId: string, orderId: string): void {
    console.log(`Sending email to user ${userId} for order ${orderId}`);
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
