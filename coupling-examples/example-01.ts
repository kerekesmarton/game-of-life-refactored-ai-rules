/**
 * Workshop Example 01 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Example of Data Coupling (GOOD) - passing primitives
export class TaxCalculator {
  calculateSalesTax(price: number, taxRate: number): number {
    console.log(`Calculating tax: ${price} * ${taxRate}`);
    return price * taxRate;
  }

  calculateTotalWithTax(price: number, taxRate: number): number {
    const tax = this.calculateSalesTax(price, taxRate);
    return price + tax;
  }
}

// Example of Data Coupling (GOOD) - passing object where ALL data is used
class Address {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public zipCode: string
  ) {}
}

export class AddressFormatter {
  // All fields of Address are used - this is Data Coupling
  formatAddress(address: Address): string {
    return `${address.street}\n${address.city}, ${address.state} ${address.zipCode}`;
  }

  validateAddress(address: Address): boolean {
    // Uses ALL fields of the address
    const hasStreet = address.street.length > 0;
    const hasCity = address.city.length > 0;
    const hasState = address.state.length === 2;
    const hasZip = address.zipCode.length === 5;

    return hasStreet && hasCity && hasState && hasZip;
  }
}

// Usage
const calculator = new TaxCalculator();
const total = calculator.calculateTotalWithTax(100, 0.08); // Passes only what's needed

const formatter = new AddressFormatter();
const address = new Address("123 Main St", "Springfield", "IL", "62701");
const formatted = formatter.formatAddress(address); // Uses all address data

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. Why is this considered good coupling?
 * 3. What are the characteristics of this coupling type?
 * 4. How does this compare to other coupling types?
 */
