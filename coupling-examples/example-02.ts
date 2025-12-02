/**
 * Workshop Example 02 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Data Coupling with primitives
export class StringUtils {
  uppercase(text: string): string {
    return text.toUpperCase();
  }

  concatenate(first: string, second: string): string {
    return first + second;
  }

  repeat(text: string, times: number): string {
    return text.repeat(times);
  }
}

// Data Coupling with a focused object where ALL data is used
class Point {
  constructor(public x: number, public y: number) {}
}

export class DistanceCalculator {
  // Uses ALL fields of both Point objects
  calculateDistance(point1: Point, point2: Point): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Uses ALL fields of both Point objects
  calculateMidpoint(point1: Point, point2: Point): Point {
    return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
  }

  // Uses ALL fields of the Point object
  distanceFromOrigin(point: Point): number {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  }
}

// Data Coupling with a complete value object
class Money {
  constructor(public amount: number, public currency: string) {}
}

export class MoneyFormatter {
  // Uses ALL fields of Money object
  format(money: Money): string {
    const symbol = this.getCurrencySymbol(money.currency);
    return `${symbol}${money.amount.toFixed(2)}`;
  }

  // Uses ALL fields of both Money objects
  add(money1: Money, money2: Money): Money {
    if (money1.currency !== money2.currency) {
      throw new Error("Cannot add different currencies");
    }
    return new Money(money1.amount + money2.amount, money1.currency);
  }

  private getCurrencySymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currency] || currency;
  }
}

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. How many parameters are passed to each method?
 * 3. Are all fields of passed objects being used?
 * 4. Why is this the preferred type of coupling?
 */
