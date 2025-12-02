/**
 * Workshop Example 16 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

type EmployeeRole = "hourly-worker" | "salaried-employee" | "contractor" | "executive";

export class Employee {
  // Common fields
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  startDate: Date;

  // Hourly worker fields
  hourlyRate?: number;
  hoursWorked?: number;
  overtimeHours?: number;

  // Salaried employee fields
  annualSalary?: number;
  department?: string;
  benefits?: string[];

  // Contractor fields
  contractRate?: number;
  contractEndDate?: Date;
  invoiceCount?: number;

  // Executive fields
  stockOptions?: number;
  bonusPercentage?: number;
  companyCarAllowance?: number;
  executiveLevel?: "VP" | "SVP" | "C-Level";

  constructor(name: string, email: string, role: EmployeeRole) {
    this.id = `EMP-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.role = role;
    this.startDate = new Date();
  }

  // Hourly worker methods
  setHourlyDetails(rate: number): void {
    if (this.role !== "hourly-worker") {
      throw new Error("This method is only for hourly workers!");
    }
    this.hourlyRate = rate;
    this.hoursWorked = 0;
    this.overtimeHours = 0;
  }

  logHours(hours: number): void {
    if (this.role !== "hourly-worker") {
      throw new Error("Only hourly workers log hours!");
    }

    const regularHours = Math.min(hours, 40);
    const overtime = Math.max(0, hours - 40);

    this.hoursWorked = (this.hoursWorked || 0) + regularHours;
    this.overtimeHours = (this.overtimeHours || 0) + overtime;

    console.log(`Logged ${regularHours} regular hours, ${overtime} overtime hours`);
  }

  // Salaried employee methods
  setSalariedDetails(salary: number, department: string, benefits: string[]): void {
    if (this.role !== "salaried-employee") {
      throw new Error("This method is only for salaried employees!");
    }
    this.annualSalary = salary;
    this.department = department;
    this.benefits = benefits;
  }

  requestVacation(days: number): boolean {
    if (this.role !== "salaried-employee") {
      throw new Error("Only salaried employees have vacation days!");
    }

    console.log(`Requesting ${days} vacation days`);
    return true;
  }

  // Contractor methods
  setContractorDetails(rate: number, endDate: Date): void {
    if (this.role !== "contractor") {
      throw new Error("This method is only for contractors!");
    }
    this.contractRate = rate;
    this.contractEndDate = endDate;
    this.invoiceCount = 0;
  }

  submitInvoice(amount: number): void {
    if (this.role !== "contractor") {
      throw new Error("Only contractors submit invoices!");
    }

    this.invoiceCount = (this.invoiceCount || 0) + 1;
    console.log(`Invoice #${this.invoiceCount} submitted for $${amount}`);
  }

  isContractExpiring(): boolean {
    if (this.role !== "contractor") {
      throw new Error("Only contractors have contract end dates!");
    }

    if (!this.contractEndDate) return false;

    const daysUntilEnd = Math.floor(
      (this.contractEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilEnd <= 30;
  }

  // Executive methods
  setExecutiveDetails(
    salary: number,
    stockOptions: number,
    bonusPercentage: number,
    carAllowance: number,
    level: "VP" | "SVP" | "C-Level"
  ): void {
    if (this.role !== "executive") {
      throw new Error("This method is only for executives!");
    }
    this.annualSalary = salary;
    this.stockOptions = stockOptions;
    this.bonusPercentage = bonusPercentage;
    this.companyCarAllowance = carAllowance;
    this.executiveLevel = level;
  }

  exerciseStockOptions(amount: number): void {
    if (this.role !== "executive") {
      throw new Error("Only executives have stock options!");
    }

    if (!this.stockOptions || amount > this.stockOptions) {
      throw new Error("Insufficient stock options!");
    }

    this.stockOptions -= amount;
    console.log(`Exercised ${amount} stock options. Remaining: ${this.stockOptions}`);
  }

  // Mixed methods that try to handle all types
  calculatePay(): number {
    switch (this.role) {
      case "hourly-worker":
        if (!this.hourlyRate) return 0;
        const regularPay = (this.hoursWorked || 0) * this.hourlyRate;
        const overtimePay = (this.overtimeHours || 0) * this.hourlyRate * 1.5;
        return regularPay + overtimePay;

      case "salaried-employee":
        return (this.annualSalary || 0) / 12;

      case "contractor":
        // Contractors don't get regular pay, they invoice
        return 0;

      case "executive":
        const basePay = (this.annualSalary || 0) / 12;
        const bonus = basePay * ((this.bonusPercentage || 0) / 100);
        return basePay + bonus + (this.companyCarAllowance || 0);

      default:
        return 0;
    }
  }

  getTotalCompensation(): number {
    let total = this.calculatePay();

    if (this.role === "executive" && this.stockOptions) {
      total += this.stockOptions * 50; // Assume $50 per option
    }

    return total;
  }

  getEmploymentSummary(): string {
    let summary = `${this.name} (${this.role})`;

    if (this.role === "hourly-worker" && this.hourlyRate) {
      summary += ` - $${this.hourlyRate}/hour`;
    } else if (this.role === "salaried-employee" && this.department) {
      summary += ` - ${this.department} dept`;
    } else if (this.role === "contractor" && this.contractEndDate) {
      summary += ` - contract until ${this.contractEndDate.toLocaleDateString()}`;
    } else if (this.role === "executive" && this.executiveLevel) {
      summary += ` - ${this.executiveLevel}`;
    }

    return summary;
  }

  canAccessExecutiveLounge(): boolean {
    return this.role === "executive";
  }

  needsW2Form(): boolean {
    return this.role === "hourly-worker" || this.role === "salaried-employee" || this.role === "executive";
  }

  needs1099Form(): boolean {
    return this.role === "contractor";
  }
}

// Usage examples showing the problem
const worker = new Employee("John Doe", "john@example.com", "hourly-worker");
worker.setHourlyDetails(25);
worker.logHours(45);

const salaried = new Employee("Jane Smith", "jane@example.com", "salaried-employee");
salaried.setSalariedDetails(75000, "Engineering", ["Health", "Dental", "401k"]);

const contractor = new Employee("Bob Johnson", "bob@example.com", "contractor");
contractor.setContractorDetails(150, new Date("2024-12-31"));

const executive = new Employee("Alice Williams", "alice@example.com", "executive");
executive.setExecutiveDetails(250000, 10000, 20, 1000, "VP");

// This causes problems:
try {
  worker.exerciseStockOptions(100); // ERROR! Workers don't have stock options
} catch (e) {
  console.log(e);
}

try {
  contractor.requestVacation(5); // ERROR! Contractors don't have vacation
} catch (e) {
  console.log(e);
}

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What problems occur when different instances use different fields?
 * 3. How can you tell which fields/methods belong to which role?
 * 4. How would you improve this design?
 *
 * Hint: Each role has its own set of fields and methods that others don't use
 */
