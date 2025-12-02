/**
 * Workshop Example 08
 * Analyze the cohesion type of this class and suggest improvements
 */

type OperationType = "add" | "subtract" | "multiply" | "divide" | "power" | "sqrt";

export class MathOperations {
  performOperation(type: OperationType, a: number, b?: number): number {
    switch (type) {
      case "add":
        return this.handleAdd(a, b!);
      case "subtract":
        return this.handleSubtract(a, b!);
      case "multiply":
        return this.handleMultiply(a, b!);
      case "divide":
        return this.handleDivide(a, b!);
      case "power":
        return this.handlePower(a, b!);
      case "sqrt":
        return this.handleSquareRoot(a);
      default:
        throw new Error(`Unknown operation: ${type}`);
    }
  }

  private handleAdd(a: number, b: number): number {
    console.log(`Adding ${a} + ${b}`);
    return a + b;
  }

  private handleSubtract(a: number, b: number): number {
    console.log(`Subtracting ${a} - ${b}`);
    return a - b;
  }

  private handleMultiply(a: number, b: number): number {
    console.log(`Multiplying ${a} * ${b}`);
    return a * b;
  }

  private handleDivide(a: number, b: number): number {
    console.log(`Dividing ${a} / ${b}`);
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  }

  private handlePower(a: number, b: number): number {
    console.log(`Calculating ${a} ^ ${b}`);
    return Math.pow(a, b);
  }

  private handleSquareRoot(a: number): number {
    console.log(`Calculating sqrt(${a})`);
    if (a < 0) {
      throw new Error("Cannot calculate square root of negative number");
    }
    return Math.sqrt(a);
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
