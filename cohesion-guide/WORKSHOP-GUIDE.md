# Function Cohesion Workshop Guide

## Overview

This workshop helps participants understand different types of cohesion in software design. Each example demonstrates a specific cohesion type, and participants must identify which type and suggest improvements.

## Workshop Format

1. **Divide into Groups**: Split participants into 10 small groups
2. **Assign Examples**: Give each group one example file
3. **Analysis Time**: 10-15 minutes to analyze and discuss
4. **Presentations**: Each group presents their findings (3-5 minutes each)
5. **Discussion**: Facilitate discussion on cohesion principles

## Cohesion Types (Best to Worst)

1. **Functional** ⭐⭐⭐⭐⭐ - One specific, well-defined purpose
2. **Sequential** ⭐⭐⭐⭐ - Output of one function feeds into the next
3. **Communicational** ⭐⭐⭐ - Functions operate on the same data
4. **Procedural** ⭐⭐ - Functions related by domain/use case
5. **Temporal** ⭐ - Functions grouped by timing
6. **Logical** ⭐ - Functions selected by control parameter
7. **Coincidental** 💀 - No meaningful relationship

---

## Example Solutions

### Example 01: Sequential Cohesion ⭐⭐⭐⭐

**File**: `example-01.ts` - ImageProcessor

**Identification Characteristics**:
- Each method produces output used by the next method
- Data flows through a pipeline: load → validate → resize → compress → save
- Methods are tightly coupled in sequence

**Is this good or bad?**
- **Moderately Good**: Clear data flow and processing pipeline
- **Concern**: Changes to the sequence affect the entire pipeline
- **Benefit**: Easy to understand the transformation steps

**Suggested Improvements**:
```typescript
// Option 1: Make the pipeline more flexible
class ImagePipeline {
  private steps: Array<(data: Buffer) => Buffer> = [];

  addStep(step: (data: Buffer) => Buffer): this {
    this.steps.push(step);
    return this;
  }

  process(input: Buffer): Buffer {
    return this.steps.reduce((data, step) => step(data), input);
  }
}

// Option 2: Use individual, composable functions
const processImage = compose(
  saveImage,
  compressImage,
  resizeImage,
  validateImageData,
  loadImage
);
```

---

### Example 02: Communicational Cohesion ⭐⭐⭐

**File**: `example-02.ts` - CustomerReport

**Identification Characteristics**:
- All methods operate on the same customer data fields
- Methods don't depend on each other's output
- Different operations but same data source

**Is this good or bad?**
- **Acceptable**: Related data kept together
- **Concern**: Methods serve different purposes (reporting vs validation vs formatting)
- **Risk**: Class could grow large with many unrelated operations on the same data

**Suggested Improvements**:
```typescript
// Split by responsibility
class Customer {
  constructor(
    private id: number,
    private name: string,
    private email: string,
    private phone: string,
    private registrationDate: Date
  ) {}

  // Core data access only
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  // ...
}

class CustomerValidator {
  validate(customer: Customer): boolean {
    // Validation logic
  }
}

class CustomerReportFormatter {
  generateEmailSummary(customer: Customer): string {
    // Formatting logic
  }
}
```

---

### Example 03: Communicational Cohesion ⭐⭐⭐

**File**: `example-03.ts` - OrderOperations

**Identification Characteristics**:
- All methods use the same OrderData structure
- Different combinations of fields in each method
- Methods serve different business purposes but share data

**Is this good or bad?**
- **Mixed**: Keeps order-related operations together
- **Concern**: Mixing validation, calculations, and reporting
- **Problem**: Class could become a "god class" with too many responsibilities

**Suggested Improvements**:
```typescript
// Split by responsibility
class Order {
  constructor(private data: OrderData) {}

  validate(): boolean {
    return new OrderValidator().validate(this.data);
  }

  calculateShipping(): number {
    return new ShippingCalculator().calculate(this.data);
  }

  generateInvoice(): string {
    return new InvoiceGenerator().generate(this.data);
  }
}

// Separate concerns
class OrderValidator { /* validation logic */ }
class ShippingCalculator { /* shipping logic */ }
class InvoiceGenerator { /* invoice logic */ }
```

---

### Example 04: Procedural Cohesion ⭐⭐

**File**: `example-04.ts` - ProductManager (CRUD)

**Identification Characteristics**:
- Functions grouped by domain (Product entity)
- Standard CRUD operations on the same data source
- Methods related by procedure, not by data flow
- Each operation is independent

**Is this good or bad?**
- **Common but problematic**: Very common in applications
- **Concern**: Mixing data access with business logic
- **Problem**: Violates Single Responsibility Principle

**Suggested Improvements**:
```typescript
// Separate data access from business logic
class ProductRepository {
  create(product: Product): void { /* DB operation */ }
  read(id: string): Product | null { /* DB operation */ }
  update(id: string, data: Partial<Product>): void { /* DB operation */ }
  delete(id: string): void { /* DB operation */ }
}

class ProductService {
  constructor(private repo: ProductRepository) {}

  createProduct(name: string, price: number, stock: number): Product {
    const product = new Product(name, price, stock);
    this.repo.create(product);
    // Business logic: notify warehouse, update inventory
    return product;
  }
}

// Even better: Use repository pattern properly
interface IProductRepository {
  save(product: Product): void;
  findById(id: string): Product | null;
  remove(id: string): void;
}
```

---

### Example 05: Procedural Cohesion ⭐⭐

**File**: `example-05.ts` - CheckoutService

**Identification Characteristics**:
- Functions follow a business process workflow
- Steps are related by the checkout procedure
- Functions don't use each other's outputs directly
- Related by domain (checkout process)

**Is this good or bad?**
- **Mixed**: Captures a business process
- **Concern**: One large method with many responsibilities
- **Problem**: Hard to test individual steps, difficult to modify

**Suggested Improvements**:
```typescript
// Extract responsibilities
class InventoryService {
  checkAvailability(items: CartItem[]): boolean { }
  reserve(items: CartItem[]): void { }
  rollback(items: CartItem[]): void { }
}

class PaymentService {
  charge(payment: PaymentInfo, amount: number): boolean { }
}

class OrderService {
  createOrder(userId: string, items: CartItem[]): string { }
}

class NotificationService {
  sendConfirmation(userId: string, orderId: string): void { }
}

// Orchestrate with a coordinator
class CheckoutCoordinator {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private orders: OrderService,
    private notifications: NotificationService
  ) {}

  processCheckout(userId: string, items: CartItem[], payment: PaymentInfo): string | null {
    if (!this.inventory.checkAvailability(items)) return null;

    this.inventory.reserve(items);

    if (!this.payment.charge(payment, this.calculateTotal(items))) {
      this.inventory.rollback(items);
      return null;
    }

    const orderId = this.orders.createOrder(userId, items);
    this.notifications.sendConfirmation(userId, orderId);

    return orderId;
  }
}
```

---

### Example 06: Temporal Cohesion ⭐

**File**: `example-06.ts` - ApplicationStartup

**Identification Characteristics**:
- Functions grouped because they run at the same time (startup)
- Operations are unrelated except for timing
- No data flow between functions
- Order matters but not because of dependencies

**Is this good or bad?**
- **Poor**: Functions only related by timing
- **Problem**: Mixing concerns (config, database, cache, server, etc.)
- **Risk**: Hard to test, hard to modify initialization order

**Suggested Improvements**:
```typescript
// Separate concerns and use dependency injection
class ConfigurationService {
  load(): Config { /* load config */ }
}

class DatabaseService {
  connect(config: DbConfig): void { /* connect */ }
}

class CacheService {
  initialize(config: CacheConfig): void { /* init cache */ }
}

// Application coordinates startup
class Application {
  constructor(
    private config: ConfigurationService,
    private db: DatabaseService,
    private cache: CacheService,
    private server: WebServer
  ) {}

  async start(): Promise<void> {
    const config = this.config.load();
    await this.db.connect(config.database);
    await this.cache.initialize(config.cache);
    await this.server.start(config.server);
  }
}

// Even better: Use a framework with lifecycle hooks
class DatabaseModule implements OnApplicationStartup {
  onStartup(): void {
    // Initialize database
  }
}
```

---

### Example 07: Temporal Cohesion ⭐

**File**: `example-07.ts` - ResourceCleanup

**Identification Characteristics**:
- Functions grouped because they run at shutdown time
- Operations are independent
- No meaningful relationship except timing
- Could be executed in different orders

**Is this good or bad?**
- **Poor**: Only related by when they execute
- **Problem**: Mixing different types of cleanup (logs, sessions, connections, files)
- **Issue**: Each cleanup type should be handled by the responsible component

**Suggested Improvements**:
```typescript
// Each component manages its own lifecycle
interface Disposable {
  dispose(): void;
}

class LogService implements Disposable {
  dispose(): void {
    this.flushPendingLogs();
  }

  private flushPendingLogs(): void { }
}

class SessionService implements Disposable {
  dispose(): void {
    this.saveActiveSessions();
  }

  private saveActiveSessions(): void { }
}

class DatabaseService implements Disposable {
  dispose(): void {
    this.closeConnections();
  }

  private closeConnections(): void { }
}

// Application coordinates shutdown
class Application {
  private services: Disposable[] = [];

  registerService(service: Disposable): void {
    this.services.push(service);
  }

  async shutdown(): Promise<void> {
    // Each service cleans up its own resources
    for (const service of this.services) {
      await service.dispose();
    }
  }
}
```

---

### Example 08: Logical Cohesion ⭐

**File**: `example-08.ts` - MathOperations

**Identification Characteristics**:
- Functions selected by a control parameter (switch statement)
- Operations are similar in category but independent
- Caller must know which operation to request
- Functions don't share data or flow

**Is this good or bad?**
- **Poor**: Functions only grouped by category
- **Problem**: Violates Open/Closed Principle (must modify class to add operations)
- **Issue**: Forces coupling between unrelated operations

**Suggested Improvements**:
```typescript
// Option 1: Separate classes (best for complex operations)
class Addition {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class Multiplication {
  execute(a: number, b: number): number {
    return a * b;
  }
}

// Option 2: Strategy pattern
interface MathOperation {
  execute(a: number, b?: number): number;
}

class Calculator {
  constructor(private operation: MathOperation) {}

  calculate(a: number, b?: number): number {
    return this.operation.execute(a, b);
  }
}

// Option 3: Simple functions (best for simple operations)
const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const sqrt = (a: number): number => Math.sqrt(a);

// Use directly without a class wrapper
const result = add(5, 3);
```

---

### Example 09: Logical Cohesion ⭐

**File**: `example-09.ts` - DataExporter

**Identification Characteristics**:
- Different export formats selected by parameter
- Each format uses completely different logic
- Only commonality is "exporting"
- Switch/case determines which function runs

**Is this good or bad?**
- **Poor**: Functions artificially grouped
- **Problem**: Adding new formats requires modifying the class
- **Issue**: Each format should be its own responsibility

**Suggested Improvements**:
```typescript
// Strategy pattern with interface
interface DataExporter {
  export(data: UserData[]): string;
}

class JsonExporter implements DataExporter {
  export(data: UserData[]): string {
    return JSON.stringify(data, null, 2);
  }
}

class XmlExporter implements DataExporter {
  export(data: UserData[]): string {
    // XML generation logic
  }
}

class CsvExporter implements DataExporter {
  export(data: UserData[]): string {
    // CSV generation logic
  }
}

class PdfExporter implements DataExporter {
  export(data: UserData[]): string {
    // PDF generation logic
  }
}

// Factory to create exporters
class ExporterFactory {
  create(format: ExportFormat): DataExporter {
    switch (format) {
      case "json": return new JsonExporter();
      case "xml": return new XmlExporter();
      case "csv": return new CsvExporter();
      case "pdf": return new PdfExporter();
    }
  }
}

// Usage
const exporter = factory.create("json");
const result = exporter.export(data);
```

---

### Example 10: Coincidental Cohesion 💀

**File**: `example-10.ts` - HelperUtils

**Identification Characteristics**:
- Functions have NO meaningful relationship
- Completely unrelated operations (tax, email, color, weather, etc.)
- Only grouped for convenience
- "Utils" or "Helper" class name is a red flag

**Is this good or bad?**
- **WORST**: This is an anti-pattern
- **Problem**: No cohesion whatsoever
- **Issues**:
  - Hard to name meaningfully
  - Difficult to understand purpose
  - Becomes a dumping ground for random functions
  - Hard to test
  - Encourages poor design

**Suggested Improvements**:
```typescript
// Break into focused, cohesive modules

// Tax calculations belong in financial module
class TaxCalculator {
  calculate(amount: number, rate: number): number {
    return amount * rate;
  }
}

// Email validation belongs in validation module
class EmailValidator {
  validate(email: string): boolean {
    return email.includes("@") && email.includes(".");
  }
}

// Color generation belongs in UI/graphics module
class ColorGenerator {
  generateRandom(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// Array operations: use language built-ins or dedicated utility
const sortDescending = (arr: number[]): number[] =>
  [...arr].sort((a, b) => b - a);

// Weather: belongs in weather service
class WeatherService {
  async getCurrent(): Promise<string> {
    // API call
  }
}

// Security operations belong in security module
class PasswordHasher {
  hash(password: string): string {
    // Proper hashing, not base64!
  }
}

// Geometry calculations belong in geometry module
class Point {
  constructor(public x: number, public y: number) {}

  distanceTo(other: Point): number {
    return Math.sqrt(
      Math.pow(other.x - this.x, 2) +
      Math.pow(other.y - this.y, 2)
    );
  }
}

// Phone formatting belongs in formatting module
class PhoneNumberFormatter {
  format(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
}

// Math operations: use language built-ins or math module
class PrimeChecker {
  isPrime(n: number): boolean {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
}
```

**Key Lesson**: If you can't name your class without using "Utils", "Helper", "Manager", or "Handler", it's probably suffering from coincidental cohesion. Each function should find a proper home in a cohesive module.

---

## Workshop Discussion Points

### General Questions for All Examples

1. **How easy is it to name this class?**
   - Good cohesion → Easy, meaningful names
   - Poor cohesion → Generic names (Utils, Manager, Handler)

2. **How easy is it to test?**
   - Good cohesion → Small, focused tests
   - Poor cohesion → Large, complex test suites

3. **How likely is this class to change?**
   - Good cohesion → Single reason to change
   - Poor cohesion → Multiple reasons to change

4. **How easy is it to understand?**
   - Good cohesion → Clear purpose
   - Poor cohesion → Must read all code to understand

### Key Takeaways

1. **Functional cohesion is the goal** - Each class/function should have one clear purpose
2. **Watch for temporal and logical cohesion** - Common anti-patterns
3. **"Utils" is a code smell** - Usually indicates coincidental cohesion
4. **Test your naming** - Hard to name? Probably poor cohesion
5. **Single Responsibility Principle** - Directly related to cohesion

### Signs of Poor Cohesion

- Generic names (Utils, Helper, Manager, Handler)
- Switch statements determining behavior
- Functions grouped by timing
- Long parameter lists
- Hard to write meaningful tests
- Difficult to explain what the class does

### Benefits of Good Cohesion

- Easy to understand and maintain
- Easy to test
- Easy to reuse
- Easy to modify
- Clear responsibilities
- Minimal coupling

---

## Class Cohesion Examples (Examples 11-16)

The following examples demonstrate **class-level cohesion issues** rather than function-level cohesion. These are common anti-patterns in object-oriented design.

### Class Cohesion Types

1. **Mixed-Role Cohesion** 💀 - Class manages unrelated same-level entities
2. **Mixed-Domain Cohesion** 💀 - Class spans multiple architectural layers
3. **Mixed-Instance Cohesion** 💀 - Different instances use different subsets of fields/methods

---

### Example 11: Mixed-Role Cohesion 💀

**File**: `example-11.ts` - UserOrderManager

**Identification Characteristics**:
- Class manages two unrelated entities (Users and Orders)
- Two separate data stores (users Map and orders Map)
- Two sets of CRUD operations
- Only relationship is that orders reference users

**What problems does this create?**
- **Violates Single Responsibility Principle**: Two reasons to change
- **Hard to test**: Must test user operations AND order operations together
- **Tight coupling**: Changes to user logic could break order logic
- **Poor reusability**: Can't use user management without order management
- **Unclear naming**: "Manager" suffix is a code smell

**Suggested Improvements**:
```typescript
// Separate into distinct responsibilities
class UserRepository {
  private users: Map<string, User> = new Map();

  create(name: string, email: string): User {
    const user: User = {
      id: `USER-${Date.now()}`,
      name,
      email,
    };
    this.users.set(user.id, user);
    return user;
  }

  findById(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  update(userId: string, updates: Partial<User>): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    Object.assign(user, updates);
    return true;
  }

  delete(userId: string): boolean {
    return this.users.delete(userId);
  }
}

class OrderRepository {
  private orders: Map<string, Order> = new Map();

  create(userId: string, items: string[], total: number): Order {
    const order: Order = {
      id: `ORDER-${Date.now()}`,
      userId,
      items,
      total,
    };
    this.orders.set(order.id, order);
    return order;
  }

  findById(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  findByUserId(userId: string): Order[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  delete(orderId: string): boolean {
    return this.orders.delete(orderId);
  }
}

// Coordinator for complex operations that involve both
class UserAccountService {
  constructor(
    private userRepo: UserRepository,
    private orderRepo: OrderRepository
  ) {}

  deleteUserAccount(userId: string): boolean {
    // Business logic: delete orders before user
    const orders = this.orderRepo.findByUserId(userId);
    orders.forEach((order) => this.orderRepo.delete(order.id));
    return this.userRepo.delete(userId);
  }

  getUserProfile(userId: string): { user: User | null; orders: Order[] } {
    return {
      user: this.userRepo.findById(userId),
      orders: this.orderRepo.findByUserId(userId),
    };
  }
}
```

**Key Lesson**: Each class should manage ONE type of entity. Use coordinators/services for operations that span multiple entities.

---

### Example 12: Mixed-Role Cohesion 💀

**File**: `example-12.ts` - AuthenticationEmailService

**Identification Characteristics**:
- Manages two completely unrelated concerns (authentication and email)
- Two separate data stores (sessions and emailQueue)
- Methods grouped by technical category, not by business domain
- Only connection is that login sends an email

**What problems does this create?**
- **Violates Single Responsibility Principle**: Multiple unrelated reasons to change
- **Hard to test**: Must mock email when testing authentication
- **Poor separation of concerns**: Email delivery failures affect authentication
- **Difficult to scale**: Can't scale authentication independently from email
- **Unclear dependencies**: Not obvious that authentication requires email service

**Suggested Improvements**:
```typescript
// Separate authentication
class AuthenticationService {
  private sessions: Map<string, AuthToken> = new Map();

  login(username: string, password: string): AuthToken | null {
    if (password.length < 8) return null;

    const token: AuthToken = {
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 3600000),
    };

    this.sessions.set(username, token);
    return token;
  }

  logout(username: string): void {
    this.sessions.delete(username);
  }

  validateToken(username: string, token: string): boolean {
    const session = this.sessions.get(username);
    if (!session) return false;
    if (session.token !== token) return false;
    if (session.expiresAt < new Date()) {
      this.sessions.delete(username);
      return false;
    }
    return true;
  }

  refreshToken(username: string): AuthToken | null {
    const session = this.sessions.get(username);
    if (!session) return null;

    const newToken: AuthToken = {
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 3600000),
    };

    this.sessions.set(username, newToken);
    return newToken;
  }

  private generateToken(): string {
    return `TOKEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Separate email service
class EmailService {
  private emailQueue: EmailMessage[] = [];

  send(to: string, subject: string, body: string): void {
    this.emailQueue.push({ to, subject, body });
  }

  sendWelcome(email: string, username: string): void {
    this.send(email, "Welcome!", `Hello ${username}, welcome!`);
  }

  sendPasswordReset(email: string, resetToken: string): void {
    this.send(
      email,
      "Password Reset",
      `Reset link: https://example.com/reset?token=${resetToken}`
    );
  }

  sendLoginNotification(email: string, ipAddress: string): void {
    this.send(
      email,
      "New Login Detected",
      `Login from IP: ${ipAddress}`
    );
  }

  processQueue(): void {
    this.emailQueue.forEach((email) => {
      console.log(`Sending to ${email.to}: ${email.subject}`);
    });
    this.emailQueue = [];
  }
}

// Coordinator for login workflow
class LoginController {
  constructor(
    private authService: AuthenticationService,
    private emailService: EmailService
  ) {}

  login(username: string, password: string, email: string): AuthToken | null {
    const token = this.authService.login(username, password);

    if (token) {
      // Send notification asynchronously - don't let email failures affect login
      this.emailService.sendLoginNotification(email, "192.168.1.1");
    }

    return token;
  }
}
```

**Key Lesson**: Don't group services just because they're "used together." Each service should have a single, focused responsibility.

---

### Example 13: Mixed-Domain Cohesion 💀

**File**: `example-13.ts` - Product (with database and UI)

**Identification Characteristics**:
- Domain model includes database operations (save, update, delete, findById)
- Domain model includes presentation logic (formatForDisplay, getStatusBadge)
- Domain model includes API/HTTP operations (fetchFromAPI, syncToAPI)
- Mixes business logic with infrastructure concerns

**What problems does this create?**
- **Violates Separation of Concerns**: Domain logic mixed with infrastructure
- **Hard to test**: Must mock database and API to test business logic
- **Poor reusability**: Can't use domain logic without database/UI dependencies
- **Tight coupling**: Changes to database schema affect domain model
- **Violates Dependency Inversion**: Domain depends on infrastructure

**Suggested Improvements**:
```typescript
// Domain layer - Pure business logic
class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
    public stock: number,
    public categoryId: string,
    public readonly createdAt: Date
  ) {}

  isInStock(): boolean {
    return this.stock > 0;
  }

  canFulfillOrder(quantity: number): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): boolean {
    if (!this.canFulfillOrder(quantity)) return false;
    this.stock -= quantity;
    return true;
  }

  calculateDiscount(discountPercent: number): number {
    return this.price * (1 - discountPercent / 100);
  }

  getStockStatus(): "out-of-stock" | "low-stock" | "in-stock" {
    if (this.stock === 0) return "out-of-stock";
    if (this.stock < 5) return "low-stock";
    return "in-stock";
  }
}

// Data layer - Database operations
class ProductRepository {
  async save(product: Product): Promise<void> {
    console.log("INSERT INTO products...");
    // Database operation
  }

  async update(product: Product): Promise<void> {
    console.log("UPDATE products...");
    // Database operation
  }

  async delete(id: string): Promise<void> {
    console.log("DELETE FROM products...");
    // Database operation
  }

  async findById(id: string): Promise<Product | null> {
    console.log("SELECT * FROM products...");
    // Database query
    return null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    console.log("SELECT * FROM products WHERE category_id=...");
    return [];
  }
}

// Presentation layer - UI formatting
class ProductFormatter {
  formatForDisplay(product: Product): string {
    return `<div class="product">
      <h2>${product.name}</h2>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="stock">${product.stock} in stock</p>
    </div>`;
  }

  getStatusBadge(product: Product): string {
    const status = product.getStockStatus();
    const badgeClass = {
      "out-of-stock": "badge-red",
      "low-stock": "badge-yellow",
      "in-stock": "badge-green",
    }[status];

    const label = status.replace("-", " ");
    return `<span class="${badgeClass}">${label}</span>`;
  }

  formatAsCsv(product: Product): string {
    return `${product.id},${product.name},${product.price},${product.stock}`;
  }

  toJSON(product: Product): string {
    return JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });
  }
}

// API layer - HTTP operations
class ProductApiClient {
  constructor(private baseUrl: string) {}

  async fetch(productId: string): Promise<Product> {
    console.log(`GET ${this.baseUrl}/products/${productId}`);
    // HTTP call
    throw new Error("Not implemented");
  }

  async sync(product: Product): Promise<void> {
    console.log(`PUT ${this.baseUrl}/products/${product.id}`);
    // HTTP call
  }
}

// Application service - Orchestrates layers
class ProductService {
  constructor(
    private repository: ProductRepository,
    private apiClient: ProductApiClient
  ) {}

  async getProduct(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async fulfillOrder(productId: string, quantity: number): Promise<boolean> {
    const product = await this.repository.findById(productId);
    if (!product) return false;

    if (product.reduceStock(quantity)) {
      await this.repository.update(product);
      return true;
    }

    return false;
  }
}
```

**Key Lesson**: Keep domain logic pure. Infrastructure (database, API, UI) should be in separate layers that depend on the domain, not vice versa.

---

### Example 14: Mixed-Domain Cohesion 💀

**File**: `example-14.ts` - PaymentProcessor (mixing all layers)

**Identification Characteristics**:
- Business logic (validatePayment, calculateProcessingFee)
- Infrastructure (HTTP API calls)
- Data access (database operations)
- Presentation (receipt formatting)
- All in one class!

**What problems does this create?**
- **Impossible to test in isolation**: Requires mocking database, API, and more
- **Violates every SOLID principle**
- **Can't swap implementations**: Tightly coupled to specific API and database
- **Hard to maintain**: Changes to any layer affect the entire class
- **Poor reusability**: Can't reuse business logic without infrastructure

**Suggested Improvements**:
```typescript
// Domain layer - Business logic only
class PaymentValidator {
  validate(payment: PaymentDetails): boolean {
    if (payment.amount <= 0) return false;
    if (payment.cardNumber.length !== 16) return false;
    if (payment.cvv.length !== 3) return false;
    return true;
  }
}

class FeeCalculator {
  calculateProcessingFee(amount: number): number {
    const feePercent = 2.9;
    const fixedFee = 0.3;
    return amount * (feePercent / 100) + fixedFee;
  }

  calculateNetAmount(amount: number): number {
    return amount - this.calculateProcessingFee(amount);
  }
}

// Infrastructure layer - External API
interface PaymentGateway {
  charge(payment: PaymentDetails): Promise<boolean>;
  refund(transactionId: string, amount: number): Promise<boolean>;
}

class StripePaymentGateway implements PaymentGateway {
  constructor(private apiKey: string, private apiUrl: string) {}

  async charge(payment: PaymentDetails): Promise<boolean> {
    console.log(`POST ${this.apiUrl}/charges`);
    // HTTP request
    return true;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`POST ${this.apiUrl}/refunds`);
    // HTTP request
    return true;
  }
}

// Data layer - Transaction storage
interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findByUserId(userId: string): Promise<Transaction[]>;
  updateStatus(transactionId: string, status: string): Promise<void>;
}

class DatabaseTransactionRepository implements TransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    console.log("INSERT INTO transactions...");
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    console.log("SELECT * FROM transactions...");
    return [];
  }

  async updateStatus(transactionId: string, status: string): Promise<void> {
    console.log("UPDATE transactions...");
  }
}

// Presentation layer - Formatting
class ReceiptFormatter {
  format(transaction: Transaction, feeCalculator: FeeCalculator): string {
    const fee = feeCalculator.calculateProcessingFee(transaction.amount);
    const net = feeCalculator.calculateNetAmount(transaction.amount);

    return `
    ========================================
    PAYMENT RECEIPT
    ========================================
    Transaction ID: ${transaction.id}
    Amount:         $${transaction.amount.toFixed(2)}
    Processing Fee: $${fee.toFixed(2)}
    Net Amount:     $${net.toFixed(2)}
    ========================================
    `;
  }

  generateInvoiceHTML(transaction: Transaction, customerName: string): string {
    return `
    <html>
      <body>
        <h1>Invoice</h1>
        <p>Customer: ${customerName}</p>
        <p>Transaction: ${transaction.id}</p>
        <p>Amount: $${transaction.amount.toFixed(2)}</p>
      </body>
    </html>
    `;
  }
}

// Application service - Orchestrates everything
class PaymentService {
  constructor(
    private validator: PaymentValidator,
    private gateway: PaymentGateway,
    private repository: TransactionRepository,
    private formatter: ReceiptFormatter,
    private feeCalculator: FeeCalculator
  ) {}

  async processPayment(
    payment: PaymentDetails,
    userId: string
  ): Promise<{ success: boolean; receipt?: string }> {
    // Validate
    if (!this.validator.validate(payment)) {
      return { success: false };
    }

    // Process payment
    const success = await this.gateway.charge(payment);

    if (success) {
      // Save transaction
      const transaction: Transaction = {
        id: `TXN-${Date.now()}`,
        userId,
        amount: payment.amount,
        status: "completed",
      };
      await this.repository.save(transaction);

      // Generate receipt
      const receipt = this.formatter.format(transaction, this.feeCalculator);

      return { success: true, receipt };
    }

    return { success: false };
  }
}
```

**Key Lesson**: Each layer should have a single responsibility. Use interfaces to invert dependencies and allow testing/swapping implementations.

---

### Example 15: Mixed-Instance Cohesion 💀

**File**: `example-15.ts` - Vehicle (Car/Boat/Plane)

**Identification Characteristics**:
- Different vehicle types use completely different fields
- Optional fields (`numberOfDoors?`, `wingSpan?`, `hullType?`)
- Methods throw errors when called on wrong type
- Switch statements based on type field
- Each instance only uses a fraction of the available fields

**What problems does this create?**
- **Wasted memory**: Each instance has fields it doesn't use
- **Runtime errors**: Methods fail at runtime instead of compile time
- **Hard to maintain**: Adding new vehicle types requires modifying one large class
- **Poor type safety**: TypeScript can't prevent calling wrong methods
- **Violates Interface Segregation**: Each type forced to have fields it doesn't need

**Suggested Improvements**:
```typescript
// Base class with common behavior
abstract class Vehicle {
  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number
  ) {}

  abstract describe(): string;
  abstract performMaintenance(): void;
}

// Separate class for each vehicle type
class Car extends Vehicle {
  constructor(
    brand: string,
    model: string,
    year: number,
    public readonly numberOfDoors: number,
    public readonly engineType: "gasoline" | "diesel" | "electric",
    public readonly transmission: "manual" | "automatic"
  ) {
    super(`CAR-${Date.now()}`, brand, model, year);
  }

  shiftGear(gear: number): void {
    console.log(`Shifting to gear ${gear}`);
  }

  describe(): string {
    return `${this.year} ${this.brand} ${this.model} - ${this.numberOfDoors} doors, ${this.engineType} engine`;
  }

  performMaintenance(): void {
    console.log(`Checking ${this.engineType} engine`);
  }

  getCapacity(): number {
    return this.numberOfDoors + 1;
  }
}

class Boat extends Vehicle {
  constructor(
    brand: string,
    model: string,
    year: number,
    public readonly hullType: "monohull" | "catamaran" | "trimaran",
    public readonly sailArea: number,
    public readonly hasMotor: boolean
  ) {
    super(`BOAT-${Date.now()}`, brand, model, year);
  }

  adjustSails(angle: number): void {
    console.log(`Adjusting sails to ${angle} degrees`);
  }

  dropAnchor(): void {
    console.log("Anchor dropped");
  }

  describe(): string {
    return `${this.year} ${this.brand} ${this.model} - ${this.hullType}, ${this.sailArea}m² sail area`;
  }

  performMaintenance(): void {
    console.log(`Inspecting ${this.sailArea}m² of sails`);
  }

  getCapacity(): number {
    return 10;
  }
}

class Plane extends Vehicle {
  constructor(
    brand: string,
    model: string,
    year: number,
    public readonly wingSpan: number,
    public readonly maxAltitude: number,
    public readonly numberOfEngines: number,
    public readonly passengerCapacity: number
  ) {
    super(`PLANE-${Date.now()}`, brand, model, year);
  }

  takeoff(): void {
    console.log("Taking off...");
  }

  adjustAltitude(altitude: number): void {
    if (altitude > this.maxAltitude) {
      console.log(`Cannot exceed max altitude of ${this.maxAltitude}ft`);
      return;
    }
    console.log(`Adjusting altitude to ${altitude}ft`);
  }

  describe(): string {
    return `${this.year} ${this.brand} ${this.model} - ${this.wingSpan}m wingspan, ${this.numberOfEngines} engines`;
  }

  performMaintenance(): void {
    console.log(`Inspecting ${this.numberOfEngines} engines`);
  }

  getCapacity(): number {
    return this.passengerCapacity;
  }
}

// Usage - Type-safe!
const car = new Car("Toyota", "Camry", 2023, 4, "gasoline", "automatic");
car.shiftGear(3); // ✅ Works

const boat = new Boat("Beneteau", "Oceanis", 2022, "monohull", 45, true);
boat.adjustSails(30); // ✅ Works
// boat.shiftGear(3); // ❌ Compile error - method doesn't exist!

const plane = new Plane("Cessna", "172", 2021, 11, 14000, 1, 4);
plane.takeoff(); // ✅ Works
// plane.dropAnchor(); // ❌ Compile error - method doesn't exist!
```

**Alternative: Composition over Inheritance**
```typescript
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  describe(): string;
  performMaintenance(): void;
}

class Car implements Vehicle {
  // Only car-specific fields
  // No optional fields, no unused fields
}

// Even better: Use composition for vehicle capabilities
interface Driveable {
  shiftGear(gear: number): void;
}

interface Sailable {
  adjustSails(angle: number): void;
  dropAnchor(): void;
}

interface Flyable {
  takeoff(): void;
  adjustAltitude(altitude: number): void;
}

class Car implements Vehicle, Driveable {
  // Implement both interfaces
}

class Boat implements Vehicle, Sailable {
  // Implement both interfaces
}

class Plane implements Vehicle, Flyable {
  // Implement both interfaces
}
```

**Key Lesson**: If different instances use different fields/methods, split into separate classes. Use inheritance or composition to share common behavior.

---

### Example 16: Mixed-Instance Cohesion 💀

**File**: `example-16.ts` - Employee (Hourly/Salaried/Contractor/Executive)

**Identification Characteristics**:
- Four different employee types in one class
- Many optional fields that only apply to specific roles
- Methods throw errors when called on wrong role type
- Each role uses a completely different set of fields
- Switch statements everywhere

**What problems does this create?**
- **Massive class**: One class trying to be four different things
- **Runtime errors**: Type checking happens at runtime, not compile time
- **Hard to extend**: Adding new roles means modifying the mega-class
- **Poor encapsulation**: All roles exposed to all fields
- **Violates Open/Closed Principle**: Can't add new role without modifying class

**Suggested Improvements**:
```typescript
// Base interface
interface Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly startDate: Date;
  calculatePay(): number;
  getEmploymentSummary(): string;
}

// Separate class for each role
class HourlyWorker implements Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly startDate: Date;

  private hourlyRate: number;
  private hoursWorked: number = 0;
  private overtimeHours: number = 0;

  constructor(name: string, email: string, hourlyRate: number) {
    this.id = `EMP-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.startDate = new Date();
    this.hourlyRate = hourlyRate;
  }

  logHours(hours: number): void {
    const regularHours = Math.min(hours, 40);
    const overtime = Math.max(0, hours - 40);
    this.hoursWorked += regularHours;
    this.overtimeHours += overtime;
  }

  calculatePay(): number {
    const regularPay = this.hoursWorked * this.hourlyRate;
    const overtimePay = this.overtimeHours * this.hourlyRate * 1.5;
    return regularPay + overtimePay;
  }

  getEmploymentSummary(): string {
    return `${this.name} (Hourly Worker) - $${this.hourlyRate}/hour`;
  }

  needsW2Form(): boolean {
    return true;
  }
}

class SalariedEmployee implements Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly startDate: Date;

  private annualSalary: number;
  private department: string;
  private benefits: string[];

  constructor(
    name: string,
    email: string,
    salary: number,
    department: string,
    benefits: string[]
  ) {
    this.id = `EMP-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.startDate = new Date();
    this.annualSalary = salary;
    this.department = department;
    this.benefits = benefits;
  }

  requestVacation(days: number): boolean {
    console.log(`Requesting ${days} vacation days`);
    return true;
  }

  calculatePay(): number {
    return this.annualSalary / 12;
  }

  getEmploymentSummary(): string {
    return `${this.name} (Salaried Employee) - ${this.department} dept`;
  }

  needsW2Form(): boolean {
    return true;
  }
}

class Contractor implements Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly startDate: Date;

  private contractRate: number;
  private contractEndDate: Date;
  private invoiceCount: number = 0;

  constructor(
    name: string,
    email: string,
    rate: number,
    endDate: Date
  ) {
    this.id = `EMP-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.startDate = new Date();
    this.contractRate = rate;
    this.contractEndDate = endDate;
  }

  submitInvoice(amount: number): void {
    this.invoiceCount++;
    console.log(`Invoice #${this.invoiceCount} submitted for $${amount}`);
  }

  isContractExpiring(): boolean {
    const daysUntilEnd = Math.floor(
      (this.contractEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilEnd <= 30;
  }

  calculatePay(): number {
    return 0; // Contractors invoice, don't get regular pay
  }

  getEmploymentSummary(): string {
    return `${this.name} (Contractor) - contract until ${this.contractEndDate.toLocaleDateString()}`;
  }

  needs1099Form(): boolean {
    return true;
  }
}

class Executive implements Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly startDate: Date;

  private annualSalary: number;
  private stockOptions: number;
  private bonusPercentage: number;
  private companyCarAllowance: number;
  private executiveLevel: "VP" | "SVP" | "C-Level";

  constructor(
    name: string,
    email: string,
    salary: number,
    stockOptions: number,
    bonusPercentage: number,
    carAllowance: number,
    level: "VP" | "SVP" | "C-Level"
  ) {
    this.id = `EMP-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.startDate = new Date();
    this.annualSalary = salary;
    this.stockOptions = stockOptions;
    this.bonusPercentage = bonusPercentage;
    this.companyCarAllowance = carAllowance;
    this.executiveLevel = level;
  }

  exerciseStockOptions(amount: number): void {
    if (amount > this.stockOptions) {
      throw new Error("Insufficient stock options");
    }
    this.stockOptions -= amount;
    console.log(`Exercised ${amount} options. Remaining: ${this.stockOptions}`);
  }

  calculatePay(): number {
    const basePay = this.annualSalary / 12;
    const bonus = basePay * (this.bonusPercentage / 100);
    return basePay + bonus + this.companyCarAllowance;
  }

  getTotalCompensation(): number {
    return this.calculatePay() + this.stockOptions * 50;
  }

  getEmploymentSummary(): string {
    return `${this.name} (Executive) - ${this.executiveLevel}`;
  }

  canAccessExecutiveLounge(): boolean {
    return true;
  }

  needsW2Form(): boolean {
    return true;
  }
}

// Usage - Type-safe!
const worker = new HourlyWorker("John Doe", "john@example.com", 25);
worker.logHours(45); // ✅ Works

const salaried = new SalariedEmployee(
  "Jane Smith",
  "jane@example.com",
  75000,
  "Engineering",
  ["Health", "Dental"]
);
salaried.requestVacation(5); // ✅ Works

const contractor = new Contractor(
  "Bob Johnson",
  "bob@example.com",
  150,
  new Date("2024-12-31")
);
contractor.submitInvoice(15000); // ✅ Works

const executive = new Executive(
  "Alice Williams",
  "alice@example.com",
  250000,
  10000,
  20,
  1000,
  "VP"
);
executive.exerciseStockOptions(1000); // ✅ Works

// Type errors prevent mistakes:
// worker.exerciseStockOptions(100); // ❌ Compile error!
// contractor.requestVacation(5); // ❌ Compile error!
```

**Alternative: Strategy Pattern for Pay Calculation**
```typescript
interface PayCalculator {
  calculate(): number;
}

class HourlyPayCalculator implements PayCalculator {
  constructor(
    private hourlyRate: number,
    private hoursWorked: number,
    private overtimeHours: number
  ) {}

  calculate(): number {
    return (
      this.hoursWorked * this.hourlyRate +
      this.overtimeHours * this.hourlyRate * 1.5
    );
  }
}

class SalariedPayCalculator implements PayCalculator {
  constructor(private annualSalary: number) {}

  calculate(): number {
    return this.annualSalary / 12;
  }
}

// Base Employee class uses strategy
class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    private payCalculator: PayCalculator
  ) {}

  calculatePay(): number {
    return this.payCalculator.calculate();
  }
}
```

**Key Lesson**: When you have optional fields and type-based conditionals, you need separate classes. Each employee type should be its own class with only the fields it needs.

---

## Class Cohesion Discussion Points

### Signs of Poor Class Cohesion

1. **Mixed-Role**:
   - Class name contains "And", "Or", or "Manager"
   - Multiple unrelated data stores
   - Multiple sets of CRUD operations

2. **Mixed-Domain**:
   - Domain model includes `save()`, `update()`, SQL queries
   - Business logic mixed with HTTP calls or UI formatting
   - Can't test business logic without database/API

3. **Mixed-Instance**:
   - Many optional fields (`field?: Type`)
   - Methods that throw errors for wrong types
   - Switch statements based on type field
   - Each instance uses < 50% of available fields

### Refactoring Strategies

**For Mixed-Role**:
- Extract each entity into its own repository/service
- Create coordinators for operations spanning multiple entities
- Use dependency injection to compose services

**For Mixed-Domain**:
- Separate domain, data, and presentation layers
- Use repository pattern for data access
- Use formatters/presenters for UI concerns
- Keep domain models pure (no infrastructure dependencies)

**For Mixed-Instance**:
- Extract each type into its own class
- Use inheritance for shared behavior
- Use composition for capabilities
- Make illegal states unrepresentable with types

---

## Facilitator Notes

### Time Management
- 10 minutes: Introduction to cohesion concepts
- 15 minutes: Group analysis time
- 30 minutes: Presentations (3 min per group)
- 10 minutes: Wrap-up and key takeaways

### Tips for Facilitation
1. Encourage groups to first identify characteristics before naming the type
2. Remind them there's no "trick" - examples clearly demonstrate each type
3. Focus discussion on practical improvements, not just identification
4. Connect to their real-world code experiences
5. Emphasize that this is about recognizing patterns, not memorizing definitions

### Common Misconceptions
- **"Procedural is always bad"**: It's common in CRUD operations, just recognize it
- **"Sequential is the same as functional"**: Sequential is about data flow, functional is about single purpose
- **"Logical cohesion with polymorphism is fine"**: Strategy pattern is better than switch statements, but still consider if operations should be separate classes

### Extension Activities
1. Have participants find examples in their own codebase
2. Refactor one example as a group
3. Create "before and after" comparisons
4. Discuss when to apply refactoring (ROI consideration from CLAUDE.md)

---

## Answer Key (for Facilitators)

### Function Cohesion (Examples 1-10)
1. **example-01.ts** → Sequential Cohesion
2. **example-02.ts** → Communicational Cohesion
3. **example-03.ts** → Communicational Cohesion
4. **example-04.ts** → Procedural Cohesion
5. **example-05.ts** → Procedural Cohesion
6. **example-06.ts** → Temporal Cohesion
7. **example-07.ts** → Temporal Cohesion
8. **example-08.ts** → Logical Cohesion
9. **example-09.ts** → Logical Cohesion
10. **example-10.ts** → Coincidental Cohesion

### Class Cohesion (Examples 11-16)
11. **example-11.ts** → Mixed-Role Cohesion (User + Order management)
12. **example-12.ts** → Mixed-Role Cohesion (Authentication + Email)
13. **example-13.ts** → Mixed-Domain Cohesion (Domain + Data + Presentation)
14. **example-14.ts** → Mixed-Domain Cohesion (All layers in one class)
15. **example-15.ts** → Mixed-Instance Cohesion (Vehicle types)
16. **example-16.ts** → Mixed-Instance Cohesion (Employee types)
