/**
 * Workshop Example 06 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Control Coupling - operation type controls behavior
export class FileHandler {
  handleFile(
    filename: string,
    operation: "read" | "write" | "append" | "delete"
  ): void {
    // Operation parameter controls the entire method behavior
    switch (operation) {
      case "read":
        console.log(`Reading file: ${filename}`);
        // Read logic
        break;
      case "write":
        console.log(`Writing file: ${filename}`);
        // Write logic
        break;
      case "append":
        console.log(`Appending to file: ${filename}`);
        // Append logic
        break;
      case "delete":
        console.log(`Deleting file: ${filename}`);
        // Delete logic
        break;
    }
  }

  processFile(
    filename: string,
    compress: boolean,
    encrypt: boolean,
    backup: boolean
  ): void {
    // Multiple boolean flags control execution flow
    console.log(`Processing file: ${filename}`);

    if (compress) {
      console.log("Compressing...");
      // Compression logic
    }

    if (encrypt) {
      console.log("Encrypting...");
      // Encryption logic
    }

    if (backup) {
      console.log("Creating backup...");
      // Backup logic
    }
  }
}

// Control Coupling - sort order and algorithm flags
export class DataSorter {
  sort(
    data: number[],
    algorithm: "quick" | "merge" | "bubble" | "heap",
    ascending: boolean
  ): number[] {
    let sorted: number[];

    // Algorithm parameter controls which sorting method to use
    switch (algorithm) {
      case "quick":
        sorted = this.quickSort(data);
        break;
      case "merge":
        sorted = this.mergeSort(data);
        break;
      case "bubble":
        sorted = this.bubbleSort(data);
        break;
      case "heap":
        sorted = this.heapSort(data);
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }

    // Boolean flag controls direction
    return ascending ? sorted : sorted.reverse();
  }

  private quickSort(data: number[]): number[] {
    console.log("Using quick sort");
    return [...data].sort((a, b) => a - b);
  }

  private mergeSort(data: number[]): number[] {
    console.log("Using merge sort");
    return [...data].sort((a, b) => a - b);
  }

  private bubbleSort(data: number[]): number[] {
    console.log("Using bubble sort");
    return [...data].sort((a, b) => a - b);
  }

  private heapSort(data: number[]): number[] {
    console.log("Using heap sort");
    return [...data].sort((a, b) => a - b);
  }
}

// Control Coupling - notification method flag
export class NotificationService {
  sendNotification(
    userId: string,
    message: string,
    method: "email" | "sms" | "push" | "all",
    priority: "low" | "normal" | "high" | "urgent"
  ): void {
    console.log(`Sending ${priority} priority notification to user ${userId}`);

    // Method parameter controls delivery method
    if (method === "email" || method === "all") {
      console.log(`Sending email: ${message}`);
    }

    if (method === "sms" || method === "all") {
      console.log(`Sending SMS: ${message}`);
    }

    if (method === "push" || method === "all") {
      console.log(`Sending push notification: ${message}`);
    }

    // Priority parameter controls urgency handling
    if (priority === "urgent") {
      console.log("Sending immediate delivery!");
    } else if (priority === "high") {
      console.log("Adding to high priority queue");
    } else {
      console.log("Adding to normal queue");
    }
  }
}

// Control Coupling - calculation type flag
export class Calculator {
  calculate(
    a: number,
    b: number,
    operation: "add" | "subtract" | "multiply" | "divide" | "power" | "modulo"
  ): number {
    // Operation parameter controls which calculation to perform
    switch (operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        if (b === 0) throw new Error("Division by zero");
        return a / b;
      case "power":
        return Math.pow(a, b);
      case "modulo":
        return a % b;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  calculateWithOptions(
    a: number,
    b: number,
    operation: string,
    roundResult: boolean,
    absoluteValue: boolean
  ): number {
    let result = this.calculate(a, b, operation as any);

    // Boolean flags control post-processing
    if (absoluteValue) {
      result = Math.abs(result);
    }

    if (roundResult) {
      result = Math.round(result);
    }

    return result;
  }
}

// Usage showing the problem
const fileHandler = new FileHandler();
fileHandler.handleFile("data.txt", "read"); // Control flag determines behavior
fileHandler.handleFile("data.txt", "delete"); // Different flag = completely different behavior
fileHandler.processFile("doc.txt", true, false, true); // Multiple flags = complex behavior

const sorter = new DataSorter();
sorter.sort([3, 1, 2], "quick", true); // Algorithm and direction flags
sorter.sort([3, 1, 2], "bubble", false); // Different flags = different behavior

const notifications = new NotificationService();
notifications.sendNotification("123", "Hello", "email", "high");
notifications.sendNotification("123", "Hello", "sms", "urgent"); // Different method + priority

const calc = new Calculator();
calc.calculate(10, 5, "add"); // Operation flag controls calculation
calc.calculate(10, 5, "divide"); // Different flag = different calculation
calc.calculateWithOptions(10, 5, "divide", true, true); // Even more control flags!

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. How do the control parameters affect the code?
 * 3. What happens when you need to add new operations/modes?
 * 4. How would you refactor to eliminate control coupling?
 *
 * Hint: Consider using separate methods or the Strategy pattern
 */
