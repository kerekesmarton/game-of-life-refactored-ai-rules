/**
 * Workshop Example 14 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

interface PaymentDetails {
  cardNumber: string;
  cvv: string;
  amount: number;
}

export class PaymentProcessor {
  private apiKey: string = "sk_test_123456";
  private apiUrl: string = "https://api.payment.com";

  // Business logic (Domain layer)
  validatePayment(payment: PaymentDetails): boolean {
    console.log("Validating payment details...");

    if (payment.amount <= 0) {
      console.log("Invalid amount");
      return false;
    }

    if (payment.cardNumber.length !== 16) {
      console.log("Invalid card number length");
      return false;
    }

    if (payment.cvv.length !== 3) {
      console.log("Invalid CVV length");
      return false;
    }

    return true;
  }

  calculateProcessingFee(amount: number): number {
    const feePercent = 2.9;
    const fixedFee = 0.3;
    return amount * (feePercent / 100) + fixedFee;
  }

  calculateNetAmount(amount: number): number {
    return amount - this.calculateProcessingFee(amount);
  }

  // HTTP/API operations (Infrastructure layer - CROSS-LAYER!)
  async processPayment(payment: PaymentDetails): Promise<boolean> {
    if (!this.validatePayment(payment)) {
      return false;
    }

    console.log("Initiating HTTP request...");
    console.log(`POST ${this.apiUrl}/charges`);

    const requestBody = JSON.stringify({
      amount: payment.amount,
      currency: "usd",
      source: payment.cardNumber,
      cvv: payment.cvv,
    });

    console.log(`Headers: { Authorization: Bearer ${this.apiKey} }`);
    console.log(`Body: ${requestBody}`);

    // Simulate API call
    await this.delay(1000);

    const response = this.simulateAPIResponse();
    console.log(`Response status: ${response.status}`);
    console.log(`Response body: ${JSON.stringify(response.body)}`);

    return response.status === 200;
  }

  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    console.log(`POST ${this.apiUrl}/refunds`);

    const requestBody = JSON.stringify({
      charge: transactionId,
      amount: amount,
    });

    console.log(`Headers: { Authorization: Bearer ${this.apiKey} }`);
    console.log(`Body: ${requestBody}`);

    await this.delay(1000);

    const response = this.simulateAPIResponse();
    return response.status === 200;
  }

  // Database operations (Data layer - CROSS-LAYER!)
  async saveTransaction(
    transactionId: string,
    amount: number,
    status: string
  ): Promise<void> {
    console.log("Connecting to database...");
    console.log(
      `INSERT INTO transactions (id, amount, status, created_at) VALUES ('${transactionId}', ${amount}, '${status}', NOW())`
    );
    await this.delay(500);
    console.log("Transaction saved");
  }

  async getTransactionHistory(userId: string): Promise<any[]> {
    console.log("Connecting to database...");
    console.log(`SELECT * FROM transactions WHERE user_id='${userId}' ORDER BY created_at DESC`);
    await this.delay(500);
    return [];
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<void> {
    console.log("Connecting to database...");
    console.log(`UPDATE transactions SET status='${status}' WHERE id='${transactionId}'`);
    await this.delay(500);
  }

  // Presentation/Logging (Presentation layer - CROSS-LAYER!)
  formatTransactionReceipt(transactionId: string, amount: number): string {
    const fee = this.calculateProcessingFee(amount);
    const net = this.calculateNetAmount(amount);

    return `
    ========================================
    PAYMENT RECEIPT
    ========================================
    Transaction ID: ${transactionId}
    Amount:         $${amount.toFixed(2)}
    Processing Fee: $${fee.toFixed(2)}
    Net Amount:     $${net.toFixed(2)}
    ========================================
    Thank you for your payment!
    `;
  }

  generateInvoiceHTML(transactionId: string, amount: number, customerName: string): string {
    return `
    <html>
      <body>
        <h1>Invoice</h1>
        <p>Customer: ${customerName}</p>
        <p>Transaction: ${transactionId}</p>
        <p>Amount: $${amount.toFixed(2)}</p>
        <p>Fee: $${this.calculateProcessingFee(amount).toFixed(2)}</p>
      </body>
    </html>
    `;
  }

  // Orchestration - mixing all layers together!
  async processAndSavePayment(
    payment: PaymentDetails,
    userId: string
  ): Promise<{ success: boolean; receipt?: string }> {
    // Business logic
    if (!this.validatePayment(payment)) {
      return { success: false };
    }

    // API call
    const success = await this.processPayment(payment);

    if (success) {
      const transactionId = `TXN-${Date.now()}`;

      // Database operation
      await this.saveTransaction(transactionId, payment.amount, "completed");

      // Presentation
      const receipt = this.formatTransactionReceipt(transactionId, payment.amount);

      return { success: true, receipt };
    }

    return { success: false };
  }

  // Helper methods
  private simulateAPIResponse(): { status: number; body: any } {
    return {
      status: 200,
      body: { id: `ch_${Date.now()}`, status: "succeeded" },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What layers are being mixed together?
 * 3. What problems does this design create?
 * 4. How would you improve this design?
 *
 * Hint: Think about domain logic, data access, API calls, and presentation
 */
