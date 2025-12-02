/**
 * Workshop Example 12 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// BAD: Deep inheritance hierarchy creates tight coupling
export class Animal {
  protected name: string;
  protected age: number;
  protected weight: number;

  constructor(name: string, age: number, weight: number) {
    this.name = name;
    this.age = age;
    this.weight = weight;
  }

  eat(): void {
    console.log(`${this.name} is eating`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }

  makeSound(): void {
    console.log("Some generic sound");
  }
}

// Inherits from Animal
export class Mammal extends Animal {
  protected furColor: string;

  constructor(name: string, age: number, weight: number, furColor: string) {
    super(name, age, weight);
    this.furColor = furColor;
  }

  giveBirth(): void {
    console.log(`${this.name} gave birth`);
  }

  produceMilk(): void {
    console.log(`${this.name} is producing milk`);
  }
}

// Inherits from Mammal
export class Dog extends Mammal {
  private breed: string;

  constructor(
    name: string,
    age: number,
    weight: number,
    furColor: string,
    breed: string
  ) {
    super(name, age, weight, furColor);
    this.breed = breed;
  }

  override makeSound(): void {
    console.log("Woof!");
  }

  fetch(): void {
    console.log(`${this.name} is fetching`);
  }
}

// Inherits from Dog - Very deep hierarchy!
export class Puppy extends Dog {
  private weeksOld: number;

  constructor(
    name: string,
    weight: number,
    furColor: string,
    breed: string,
    weeksOld: number
  ) {
    super(name, 0, weight, furColor, breed); // Age is always 0 for puppies
    this.weeksOld = weeksOld;
  }

  play(): void {
    console.log(`${this.name} the puppy is playing`);
  }

  // Puppy is tightly coupled to Dog, Mammal, and Animal!
  // Any change in any parent affects Puppy
}

// The problem: Change in Animal affects ALL descendants
// If we modify Animal.eat(), it affects Mammal, Dog, and Puppy
// Puppy is coupled to 3 parent classes!

// Another BAD example - inheriting for different reasons
export class Employee {
  constructor(
    public id: string,
    public name: string,
    public salary: number
  ) {}

  calculatePay(): number {
    return this.salary;
  }

  getDetails(): string {
    return `${this.name} (${this.id})`;
  }
}

// BAD: Manager inherits to get Employee properties
// But also adds team management - mixed responsibilities
export class Manager extends Employee {
  private teamMembers: Employee[] = [];

  constructor(id: string, name: string, salary: number) {
    super(id, name, salary);
  }

  addTeamMember(employee: Employee): void {
    // Problem: Can add self to team!
    // Problem: Can add another Manager with their own team (complex hierarchy)
    this.teamMembers.push(employee);
  }

  override calculatePay(): number {
    // Manager pay calculation is completely different
    const basePay = super.calculatePay();
    const bonus = this.teamMembers.length * 1000;
    return basePay + bonus;
  }
}

// Even worse: Multiple inheritance concerns in single hierarchy
export class Executive extends Manager {
  private stockOptions: number;

  constructor(id: string, name: string, salary: number, stockOptions: number) {
    super(id, name, salary);
    this.stockOptions = stockOptions;
  }

  override calculatePay(): number {
    // Completely different pay calculation again!
    const managerPay = super.calculatePay();
    const stockValue = this.stockOptions * 50;
    return managerPay + stockValue;
  }

  // Executive is tightly coupled to Manager AND Employee
  // Any change in pay calculation in Employee or Manager affects Executive
}

// BAD: Inheriting to add persistence
export class Database {
  save(data: any): void {
    console.log("Saving to database");
  }

  load(id: string): any {
    console.log("Loading from database");
    return {};
  }

  delete(id: string): void {
    console.log("Deleting from database");
  }
}

// BAD: "User is-a Database" - WRONG!
// Using inheritance just to get save/load/delete methods
export class User extends Database {
  constructor(
    public id: string,
    public username: string,
    public email: string
  ) {
    super();
  }

  // Now has save(), load(), delete() methods
  // But User is NOT a Database!
  // This is tight coupling through inheritance misuse
}

// BETTER: Showing the composition alternative
export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number
  ) {}
}

// Good: Composition over inheritance
export class ProductRepository {
  private database: Database;

  constructor(database: Database) {
    this.database = database; // Composition!
  }

  saveProduct(product: Product): void {
    this.database.save(product);
  }

  loadProduct(id: string): Product {
    return this.database.load(id) as Product;
  }

  deleteProduct(id: string): void {
    this.database.delete(id);
  }

  // ProductRepository uses Database without inheriting from it
  // This is loose coupling!
}

// Usage showing the problems
const puppy = new Puppy("Max", 5, "brown", "Labrador", 8);
puppy.play(); // Puppy method
puppy.fetch(); // Dog method
puppy.giveBirth(); // Mammal method - but puppies can't give birth!
puppy.eat(); // Animal method

// Puppy inherited methods it shouldn't have!
// Changes to Animal, Mammal, or Dog will affect Puppy

const executive = new Executive("E001", "Alice", 150000, 10000);
const pay = executive.calculatePay(); // Depends on 3 levels of inheritance
// Any change to pay calculation in Employee or Manager breaks Executive

const user = new User("U001", "john", "john@example.com");
user.save(); // User can save itself - seems convenient
user.delete(); // But this is misleading - User IS NOT a Database
// Tight coupling - if Database changes, User breaks

/**
 * Questions for discussion:
 * 1. What problems does deep inheritance hierarchy create?
 * 2. When is inheritance appropriate vs. inappropriate?
 * 3. What is "Composition over Inheritance"?
 * 4. How would you refactor these examples using composition?
 * 5. Why is inheritance the strongest coupling?
 *
 * Hint: Use inheritance only for true "is-a-kind-of" relationships
 */
