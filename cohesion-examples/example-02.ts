/**
 * Workshop Example 02
 * Analyze the cohesion type of this class and suggest improvements
 */

export class CustomerReport {
  private customerId: number;
  private customerName: string;
  private customerEmail: string;
  private customerPhone: string;
  private registrationDate: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    phone: string,
    registered: Date
  ) {
    this.customerId = id;
    this.customerName = name;
    this.customerEmail = email;
    this.customerPhone = phone;
    this.registrationDate = registered;
  }

  generateEmailSummary(): string {
    // Uses customer name and email
    return `Customer Summary for ${this.customerName} (${this.customerEmail})\n` +
           `ID: ${this.customerId}\n` +
           `Member since: ${this.registrationDate.toLocaleDateString()}`;
  }

  validateContactInfo(): boolean {
    // Uses customer email and phone
    const emailValid = this.customerEmail.includes("@");
    const phoneValid = this.customerPhone.length >= 10;
    console.log(`Validating ${this.customerName}: email=${emailValid}, phone=${phoneValid}`);
    return emailValid && phoneValid;
  }

  formatForDisplay(): string {
    // Uses customer name, email, and phone
    return `${this.customerName}\n${this.customerEmail}\n${this.customerPhone}`;
  }

  calculateMembershipDuration(): number {
    // Uses registration date and customer name for logging
    const now = new Date();
    const days = Math.floor(
      (now.getTime() - this.registrationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log(`${this.customerName} has been a member for ${days} days`);
    return days;
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
