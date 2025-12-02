/**
 * Workshop Example 03 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// A large object with many fields
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Stamp Coupling - passing entire User object but only using email
export class EmailService {
  sendWelcomeEmail(user: User): void {
    // Only uses user.email from the entire User object!
    console.log(`Sending welcome email to: ${user.email}`);
    // All other fields (username, password, firstName, etc.) are ignored
  }

  sendPasswordResetEmail(user: User): void {
    // Only uses user.email
    console.log(`Sending password reset to: ${user.email}`);
  }
}

// Stamp Coupling - passing entire User but only using firstName
export class GreetingService {
  greet(user: User): string {
    // Only uses user.firstName from the entire User object!
    return `Hello, ${user.firstName}!`;
  }

  personalizedMessage(user: User): string {
    // Only uses user.firstName and user.age
    // Other fields like email, password, address, etc. are unused
    return `Welcome back, ${user.firstName}! You are ${user.age} years old.`;
  }
}

// Stamp Coupling - passing entire User but only using role
export class AuthorizationChecker {
  canAccessAdminPanel(user: User): boolean {
    // Only uses user.role from the entire User object!
    return user.role === "admin" || user.role === "superadmin";
  }

  canEditContent(user: User): boolean {
    // Only uses user.role
    return user.role === "admin" || user.role === "editor";
  }
}

// Usage showing the problem
const user: User = {
  id: "123",
  username: "johndoe",
  email: "john@example.com",
  password: "hashed_password",
  firstName: "John",
  lastName: "Doe",
  age: 30,
  address: "123 Main St",
  phoneNumber: "555-1234",
  role: "user",
  isActive: true,
  createdAt: new Date(),
  lastLogin: new Date(),
};

const emailService = new EmailService();
emailService.sendWelcomeEmail(user); // Passes entire object, uses only email!

const greetingService = new GreetingService();
greetingService.greet(user); // Passes entire object, uses only firstName!

const authChecker = new AuthorizationChecker();
authChecker.canAccessAdminPanel(user); // Passes entire object, uses only role!

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. What problems does this coupling create?
 * 3. How much of the User object is actually used by each method?
 * 4. How would you improve this code?
 *
 * Hint: Look at what data each method actually needs vs. what it receives
 */
