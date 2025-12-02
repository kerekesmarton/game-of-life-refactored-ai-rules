/**
 * Workshop Example 11 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Inheritance Coupling - MISUSE of inheritance for code reuse
// "Stack is-a ArrayList" - FALSE! This is not a specialization relationship

export class ArrayList<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(index: number): T | undefined {
    return this.items.splice(index, 1)[0];
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  set(index: number, item: T): void {
    this.items[index] = item;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  // Many other list operations...
  insertAt(index: number, item: T): void {
    this.items.splice(index, 0, item);
  }

  removeAll(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }
}

// BAD: Inheritance Coupling - using inheritance just for code reuse!
// Stack is NOT a kind-of ArrayList - it's a different data structure
export class Stack<T> extends ArrayList<T> {
  // Stack should only have push, pop, peek
  // But it inherits ALL ArrayList methods!

  push(item: T): void {
    this.add(item); // Reuses parent method
  }

  pop(): T | undefined {
    return this.remove(this.size() - 1); // Reuses parent methods
  }

  peek(): T | undefined {
    return this.get(this.size() - 1); // Reuses parent method
  }
}

// The problem with this inheritance:
const stack = new Stack<number>();
stack.push(1); // Correct stack operation
stack.push(2); // Correct stack operation
stack.push(3); // Correct stack operation

// But Stack inherited ALL ArrayList methods!
stack.set(0, 999); // Can modify middle of stack - WRONG!
stack.insertAt(1, 888); // Can insert in middle - WRONG!
stack.remove(1); // Can remove from middle - WRONG!
console.log(stack.get(0)); // Can access any position - WRONG!

// Stack invariants are broken!

// Another BAD example - Rectangle/Square problem
export class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// BAD: "Square is-a Rectangle" seems logical, but creates problems!
export class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  // Square must maintain width === height
  override setWidth(width: number): void {
    this.width = width;
    this.height = width; // Must keep them equal!
  }

  override setHeight(height: number): void {
    this.width = height; // Must keep them equal!
    this.height = height;
  }
}

// The inheritance coupling creates problems:
function resizeRectangle(rect: Rectangle): void {
  rect.setWidth(5);
  rect.setHeight(10);
  // Expect area to be 50
  console.log(`Area: ${rect.getArea()}`);
}

const rectangle = new Rectangle(1, 1);
resizeRectangle(rectangle); // Area: 50 ✓

const square = new Square(1);
resizeRectangle(square); // Area: 100 ✗ - Square breaks expectations!
// Square is not truly substitutable for Rectangle - violates LSP

// Another BAD example - inheriting for utility methods
export class StringUtils {
  static isEmpty(str: string): boolean {
    return str.length === 0;
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static reverse(str: string): string {
    return str.split("").reverse().join("");
  }
}

// BAD: Inheriting just to get utility methods
export class UserName extends StringUtils {
  constructor(private name: string) {
    super();
  }

  getName(): string {
    return this.name;
  }

  // Now has isEmpty, capitalize, reverse as static methods
  // But "UserName is-a StringUtils" makes no sense!
}

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. Why is inheritance the strongest form of coupling?
 * 3. What problems does misusing inheritance create?
 * 4. When SHOULD you use inheritance?
 * 5. How would you refactor these examples to use composition instead?
 *
 * Hint: Inheritance should only be used for "is-a-kind-of" relationships
 */
