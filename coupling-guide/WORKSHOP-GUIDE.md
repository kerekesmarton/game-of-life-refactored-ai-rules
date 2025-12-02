
# Coupling Workshop Guide

## Overview

This workshop helps participants understand different types of coupling in software design. Coupling refers to the degree of interdependence between software modules.

## Workshop Format

1. **Divide into Groups**: Split participants into 12 small groups
2. **Assign Examples**: Give each group one example file
3. **Analysis Time**: 10-15 minutes to analyze and discuss
4. **Presentations**: Each group presents their findings (3-5 minutes each)
5. **Discussion**: Facilitate discussion on coupling principles

## Coupling Types (Best to Worst)

### Interaction Coupling

1. **Data Coupling** ⭐⭐⭐⭐⭐ (BEST) - Pass only what's needed; all passed data is used
2. **Stamp Coupling** ⭐⭐⭐ - Pass object but only use part of it
3. **Control Coupling** ⭐⭐ - Pass flag/parameter that controls execution flow
4. **Common/Global Coupling** ⭐ - Depend on global/shared data
5. **Content/Pathological Coupling** 💀 (WORST) - Reach into another object's internals

### Inheritance Coupling

6. **Inheritance Coupling** ⚠️ - Strongest coupling; use only for true "is-a" relationships

---

## Key Principles

1. **Aim for Data Coupling** - Pass only what's needed
2. **Avoid Stamp Coupling** - If only using part of object, pass that part
3. **Never use Control Coupling** - Use polymorphism or separate methods
4. **Eliminate Global Coupling** - Pass dependencies explicitly
5. **Never use Content Coupling** - Respect encapsulation
6. **Composition over Inheritance** - Use inheritance only for specialization

**Golden Rule**: Objects should tell other objects what to do, not reach into them and do it themselves.

---

## Answer Key (for Facilitators)

1. **example-01.ts** → Data Coupling (GOOD)
2. **example-02.ts** → Data Coupling (GOOD)
3. **example-03.ts** → Stamp Coupling
4. **example-04.ts** → Stamp Coupling
5. **example-05.ts** → Control Coupling
6. **example-06.ts** → Control Coupling
7. **example-07.ts** → Common/Global Coupling
8. **example-08.ts** → Common/Global Coupling
9. **example-09.ts** → Content/Pathological Coupling
10. **example-10.ts** → Content/Pathological Coupling
11. **example-11.ts** → Inheritance Coupling (Misuse)
12. **example-12.ts** → Inheritance Coupling (Misuse)

---

## Example Solutions

### Examples 01-02: Data Coupling ⭐⭐⭐⭐⭐

**Characteristics:**
- Pass primitives or simple values
- Pass objects where ALL fields are used
- Minimal dependencies
- Easy to test and reuse

**Why this is GOOD:**
- Loose coupling
- Clear dependencies
- Methods are independent
- Easy to understand and maintain

**No refactoring needed** - this is the ideal coupling level!

---

### Examples 03-04: Stamp Coupling ⭐⭐⭐

**Problem:** Passing large objects but only using a small part

**Example 03 Problem:**
```typescript
sendWelcomeEmail(user: User): void {
  // Only uses user.email from entire 13-field User object!
  console.log(`Sending to: ${user.email}`);
}
```

**Solution:** Pass only what you need
```typescript
sendWelcomeEmail(email: string): void {
  console.log(`Sending to: ${email}`);
}

greet(firstName: string): string {
  return `Hello, ${firstName}!`;
}

canAccessAdminPanel(role: string): boolean {
  return role === "admin" || role === "superadmin";
}
```

**Benefits:**
- Clearer dependencies
- Easier to test
- More reusable
- Less coupling

---

### Examples 05-06: Control Coupling ⭐⭐

**Problem:** Parameters control execution flow

**Example 05 Problem:**
```typescript
generateReport(data: any[], format: "pdf" | "excel" | "csv"): string {
  if (format === "pdf") return this.generatePDF(data);
  else if (format === "excel") return this.generateExcel(data);
  else if (format === "csv") return this.generateCSV(data);
}
```

**Solution 1:** Separate methods
```typescript
generatePDFReport(data: any[]): string {
  return "PDF content";
}

generateExcelReport(data: any[]): string {
  return "Excel content";
}

generateCSVReport(data: any[]): string {
  return "CSV content";
}
```

**Solution 2:** Strategy Pattern
```typescript
interface ReportGenerator {
  generate(data: any[]): string;
}

class PDFReportGenerator implements ReportGenerator {
  generate(data: any[]): string {
    return "PDF content";
  }
}

class ExcelReportGenerator implements ReportGenerator {
  generate(data: any[]): string {
    return "Excel content";
  }
}

// Usage
const generator = new PDFReportGenerator();
const report = generator.generate(data);
```

**Benefits:**
- Eliminates control flow coupling
- Each operation is independent
- Open/Closed Principle - can add new formats without modifying existing code
- Polymorphism instead of conditionals

---

### Examples 07-08: Common/Global Coupling ⭐

**Problem:** Classes depend on global state

**Example 07 Problem:**
```typescript
let globalUserSession = { userId: "", isAuthenticated: false };

class UserDashboard {
  displayDashboard(): void {
    if (globalUserSession.isAuthenticated) { // Global dependency!
      console.log(`Welcome ${globalUserSession.username}`);
    }
  }
}
```

**Solution:** Dependency Injection
```typescript
interface UserSession {
  userId: string;
  username: string;
  isAuthenticated: boolean;
  role: string;
}

class UserDashboard {
  constructor(private session: UserSession) {} // Inject dependency!

  displayDashboard(): void {
    if (this.session.isAuthenticated) {
      console.log(`Welcome ${this.session.username}`);
    }
  }
}

// Usage
const session: UserSession = {
  userId: "123",
  username: "john",
  isAuthenticated: true,
  role: "user"
};

const dashboard = new UserDashboard(session); // Explicit dependency
```

**Benefits:**
- Dependencies are explicit and visible
- Easy to test (can inject test doubles)
- No hidden dependencies
- Thread-safe
- Can have multiple independent instances

---

### Examples 09-10: Content/Pathological Coupling 💀

**Problem:** One object manipulates another's internals

**Example 09 Problem:**
```typescript
class BankAccount {
  balance: number; // Public - WRONG!
  transactions: Array<any>; // Public - WRONG!
}

class TransferService {
  transfer(from: BankAccount, to: BankAccount, amount: number): void {
    from.balance -= amount; // Direct manipulation - WRONG!
    to.balance += amount; // Direct manipulation - WRONG!
  }
}
```

**Solution:** Encapsulation + Tell, Don't Ask
```typescript
class BankAccount {
  private balance: number; // Private!
  private transactions: Array<Transaction> = []; // Private!

  constructor(accountNumber: string, initialBalance: number) {
    this.balance = initialBalance;
  }

  // Tell the account what to do
  withdraw(amount: number): boolean {
    if (this.balance >= amount) {
      this.balance -= amount;
      this.transactions.push({ type: "withdrawal", amount, date: new Date() });
      return true;
    }
    return false;
  }

  deposit(amount: number): void {
    this.balance += amount;
    this.transactions.push({ type: "deposit", amount, date: new Date() });
  }

  getBalance(): number {
    return this.balance;
  }

  getTransactionHistory(): ReadonlyArray<Transaction> {
    return [...this.transactions]; // Return copy, not reference
  }
}

class TransferService {
  transfer(from: BankAccount, to: BankAccount, amount: number): boolean {
    // Tell accounts what to do - don't manipulate their internals
    if (from.withdraw(amount)) {
      to.deposit(amount);
      return true;
    }
    return false;
  }
}
```

**Benefits:**
- Encapsulation maintained
- Invariants protected
- Can't create invalid state
- Easy to add validation
- Follows "Tell, Don't Ask"

---

### Examples 11-12: Inheritance Coupling ⚠️

**Problem:** Misusing inheritance for code reuse

**Example 11 Problem:**
```typescript
class ArrayList<T> {
  add(item: T): void { }
  remove(index: number): T { }
  get(index: number): T { }
  set(index: number, item: T): void { }
  insertAt(index: number, item: T): void { }
}

// BAD: Stack is NOT a kind-of ArrayList!
class Stack<T> extends ArrayList<T> {
  push(item: T): void { this.add(item); }
  pop(): T { return this.remove(this.size() - 1); }
}

// Problem: Stack inherits methods it shouldn't have!
const stack = new Stack<number>();
stack.push(1);
stack.set(0, 999); // Can modify middle of stack - WRONG!
stack.insertAt(1, 888); // Breaks stack invariant!
```

**Solution:** Composition over Inheritance
```typescript
class Stack<T> {
  private items: T[] = []; // Composition!

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }

  // Only exposes methods appropriate for a stack
  // Doesn't inherit inappropriate methods
}
```

**When to use Inheritance:**
- ✅ True "is-a-kind-of" relationship (Dog is-a-kind-of Animal)
- ✅ Specialization/generalization semantics
- ✅ Liskov Substitution Principle holds
- ✅ Subclass doesn't override behavior inappropriately

**When to use Composition:**
- ✅ Code reuse without "is-a" relationship
- ✅ Flexibility to change behavior
- ✅ Multiple concerns to combine
- ✅ "has-a" or "uses-a" relationship

**Example 12 Problem - Rectangle/Square:**
```typescript
class Rectangle {
  setWidth(width: number): void { this.width = width; }
  setHeight(height: number): void { this.height = height; }
}

// BAD: Square inherits but breaks Rectangle behavior!
class Square extends Rectangle {
  override setWidth(width: number): void {
    this.width = width;
    this.height = width; // Must keep equal
  }
}

// Problem: Square is not substitutable for Rectangle
function resize(rect: Rectangle): void {
  rect.setWidth(5);
  rect.setHeight(10);
  // Expected area: 50
}

const square = new Square(1);
resize(square); // Area: 100 - WRONG! Violates LSP
```

**Solution:** Don't use inheritance
```typescript
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  setWidth(width: number): void { this.width = width; }
  setHeight(height: number): void { this.height = height; }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private size: number) {}

  setSize(size: number): void { this.size = size; }

  getArea(): number {
    return this.size * this.size;
  }
}

// Each is independent - no inheritance coupling
```

**Benefits of Composition:**
- Loose coupling
- Flexible - can change implementations
- Can combine multiple behaviors
- Easier to test
- Follows Single Responsibility Principle

---

## Workshop Discussion Points

### Questions for All Examples

1. **Dependency Identification**
   - What does this module depend on?
   - Are the dependencies explicit or hidden?
   - Can you test this in isolation?

2. **Change Impact**
   - If module A changes, what else must change?
   - How many modules know about this module's internals?

3. **Reusability**
   - Can you reuse this module in a different context?
   - What prevents reuse?

### Signs of High Coupling (BAD)

❌ **Stamp Coupling**: Passing large objects, using small parts
❌ **Control Coupling**: Boolean flags, mode parameters, switch statements
❌ **Global Coupling**: Global variables, singletons, static state
❌ **Content Coupling**: Public fields, reaching into objects
❌ **Inheritance Misuse**: Inheriting for code reuse, not specialization

### Signs of Low Coupling (GOOD)

✅ **Data Coupling**: Pass only what's needed
✅ **Explicit Dependencies**: Constructor/method parameters
✅ **Encapsulation**: Private fields, public methods
✅ **Tell, Don't Ask**: Objects manage their own state
✅ **Composition**: Flexible "has-a" relationships

---

## Refactoring Strategies

### From Stamp to Data Coupling
**Before:**
```typescript
function printLabel(order: Order): string {
  return `Ship to: ${order.shippingAddress.street}`;
}
```

**After:**
```typescript
function printLabel(address: ShippingAddress): string {
  return `Ship to: ${address.street}`;
}
```

### From Control to Polymorphism
**Before:**
```typescript
function calculate(a: number, b: number, op: string): number {
  if (op === "add") return a + b;
  if (op === "multiply") return a * b;
}
```

**After:**
```typescript
interface Operation {
  calculate(a: number, b: number): number;
}

class Addition implements Operation {
  calculate(a: number, b: number): number {
    return a + b;
  }
}

class Multiplication implements Operation {
  calculate(a: number, b: number): number {
    return a * b;
  }
}
```

### From Global to Dependency Injection
**Before:**
```typescript
let globalConfig = { apiUrl: "..." };

class ApiClient {
  fetch(): void {
    console.log(globalConfig.apiUrl); // Global dependency
  }
}
```

**After:**
```typescript
interface Config {
  apiUrl: string;
}

class ApiClient {
  constructor(private config: Config) {} // Injected dependency

  fetch(): void {
    console.log(this.config.apiUrl);
  }
}
```

### From Content to Encapsulation
**Before:**
```typescript
class Cart {
  items: Item[] = []; // Public
  total: number = 0; // Public
}

cart.items.push(item); // Manipulating internals
cart.total += item.price; // Direct manipulation
```

**After:**
```typescript
class Cart {
  private items: Item[] = [];
  private total: number = 0;

  addItem(item: Item): void {
    this.items.push(item);
    this.total += item.price;
  }

  getTotal(): number {
    return this.total;
  }
}

cart.addItem(item); // Tell, don't ask
```

### From Inheritance to Composition
**Before:**
```typescript
class User extends Database { // Misuse of inheritance
  save(): void { super.save(this); }
}
```

**After:**
```typescript
class User {
  constructor(private database: Database) {} // Composition

  save(): void {
    this.database.save(this);
  }
}
```

---

## Facilitator Notes

### Time Management
- 10 minutes: Introduction to coupling concepts
- 15 minutes: Group analysis time
- 36 minutes: Presentations (3 min per group)
- 15 minutes: Discussion and key takeaways

### Tips for Facilitation
1. Emphasize that Data Coupling is the goal
2. Help groups identify hidden dependencies
3. Connect coupling to testing difficulty
4. Use "change impact" questions to reveal coupling
5. Emphasize "Tell, Don't Ask" principle

### Common Misconceptions
- **"Global state is convenient"**: It is, but it creates hidden dependencies
- **"Inheritance promotes reuse"**: Composition is more flexible
- **"Pass the whole object for convenience"**: Creates unnecessary coupling
- **"Control flags simplify interface"**: They create control coupling

### Key Takeaways
1. **Aim for Data Coupling** - pass only what's needed
2. **Avoid Global State** - make dependencies explicit
3. **Encapsulate** - never reach into other objects
4. **Composition over Inheritance** - prefer "has-a" over "is-a"
5. **Tell, Don't Ask** - objects manage their own state
