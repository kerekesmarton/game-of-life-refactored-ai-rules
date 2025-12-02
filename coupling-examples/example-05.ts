/**
 * Workshop Example 05 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Control Coupling - flag parameter controls execution flow
export class ReportGenerator {
  generateReport(data: any[], format: "pdf" | "excel" | "csv" | "json"): string {
    console.log(`Generating report in ${format} format`);

    // Control parameter determines which code path to execute
    if (format === "pdf") {
      return this.generatePDF(data);
    } else if (format === "excel") {
      return this.generateExcel(data);
    } else if (format === "csv") {
      return this.generateCSV(data);
    } else if (format === "json") {
      return this.generateJSON(data);
    }

    throw new Error(`Unknown format: ${format}`);
  }

  private generatePDF(data: any[]): string {
    return "PDF Report Content";
  }

  private generateExcel(data: any[]): string {
    return "Excel Report Content";
  }

  private generateCSV(data: any[]): string {
    return "CSV Report Content";
  }

  private generateJSON(data: any[]): string {
    return JSON.stringify(data);
  }
}

// Control Coupling - boolean flag controls behavior
export class DataProcessor {
  processData(data: string, shouldValidate: boolean, shouldTransform: boolean): string {
    let result = data;

    // Boolean flags control which operations are performed
    if (shouldValidate) {
      console.log("Validating data...");
      if (result.length === 0) {
        throw new Error("Invalid data");
      }
    }

    if (shouldTransform) {
      console.log("Transforming data...");
      result = result.toUpperCase();
    }

    return result;
  }

  saveData(data: string, overwrite: boolean): void {
    // Boolean flag controls behavior
    if (overwrite) {
      console.log("Overwriting existing data");
      // Delete old data first
    } else {
      console.log("Appending to existing data");
      // Check if data exists first
    }

    console.log(`Saving: ${data}`);
  }
}

// Control Coupling - mode parameter controls execution
export class PaymentProcessor {
  processPayment(
    amount: number,
    mode: "test" | "production" | "sandbox"
  ): boolean {
    // Mode parameter controls which environment to use
    if (mode === "test") {
      console.log("Processing in TEST mode - no real charges");
      return true; // Always succeeds in test
    } else if (mode === "sandbox") {
      console.log("Processing in SANDBOX mode - simulated charge");
      return Math.random() > 0.2; // 80% success rate
    } else if (mode === "production") {
      console.log("Processing in PRODUCTION mode - real charge!");
      return this.chargeRealCard(amount);
    }

    throw new Error(`Unknown mode: ${mode}`);
  }

  private chargeRealCard(amount: number): boolean {
    console.log(`Charging $${amount} to real card`);
    return true;
  }
}

// Control Coupling - action parameter controls what happens
export class UserManager {
  modifyUser(
    userId: string,
    action: "activate" | "deactivate" | "delete" | "reset"
  ): void {
    // Action parameter controls which operation to perform
    switch (action) {
      case "activate":
        console.log(`Activating user ${userId}`);
        // Activation logic
        break;
      case "deactivate":
        console.log(`Deactivating user ${userId}`);
        // Deactivation logic
        break;
      case "delete":
        console.log(`Deleting user ${userId}`);
        // Deletion logic
        break;
      case "reset":
        console.log(`Resetting user ${userId}`);
        // Reset logic
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}

// Usage showing the problem
const reportGen = new ReportGenerator();
reportGen.generateReport([], "pdf"); // Control parameter determines behavior
reportGen.generateReport([], "excel"); // Different control value = different behavior

const processor = new DataProcessor();
processor.processData("test", true, false); // Flags control execution
processor.processData("test", false, true); // Different flags = different behavior
processor.processData("test", true, true); // Yet another behavior

const paymentProc = new PaymentProcessor();
paymentProc.processPayment(100, "test"); // Mode controls behavior
paymentProc.processPayment(100, "production"); // Different mode = different behavior

const userMgr = new UserManager();
userMgr.modifyUser("123", "activate"); // Action controls behavior
userMgr.modifyUser("123", "delete"); // Different action = different behavior

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. What problems does this coupling create?
 * 3. How do the parameters control the execution flow?
 * 4. How would you refactor this code to eliminate control coupling?
 *
 * Hint: Think about using separate methods or polymorphism
 */
