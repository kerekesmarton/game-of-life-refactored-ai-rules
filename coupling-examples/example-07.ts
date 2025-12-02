/**
 * Workshop Example 07 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Global state - accessible from anywhere
let globalUserSession = {
  userId: "",
  username: "",
  isAuthenticated: false,
  role: "guest",
};

let globalConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  debugMode: false,
  maxRetries: 3,
};

let globalCache: Map<string, any> = new Map();

// Common/Global Coupling - depends on global session
export class UserDashboard {
  displayDashboard(): void {
    // Directly accesses global state
    if (globalUserSession.isAuthenticated) {
      console.log(`Welcome back, ${globalUserSession.username}!`);
      console.log(`Your role: ${globalUserSession.role}`);
    } else {
      console.log("Please log in");
    }
  }

  canAccessAdminFeatures(): boolean {
    // Depends on global session
    return globalUserSession.role === "admin";
  }
}

// Common/Global Coupling - depends on global config
export class ApiClient {
  fetchData(endpoint: string): void {
    // Directly uses global configuration
    const url = `${globalConfig.apiUrl}${endpoint}`;
    console.log(`Fetching from: ${url}`);
    console.log(`Timeout: ${globalConfig.timeout}ms`);
    console.log(`Max retries: ${globalConfig.maxRetries}`);

    if (globalConfig.debugMode) {
      console.log("DEBUG: Request details...");
    }
  }

  retryRequest(endpoint: string): void {
    // Depends on global config
    for (let i = 0; i < globalConfig.maxRetries; i++) {
      console.log(`Attempt ${i + 1} of ${globalConfig.maxRetries}`);
      this.fetchData(endpoint);
    }
  }
}

// Common/Global Coupling - depends on global cache
export class ProductService {
  getProduct(productId: string): any {
    // Checks global cache
    if (globalCache.has(productId)) {
      console.log("Retrieved from global cache");
      return globalCache.get(productId);
    }

    // Simulate fetching from database
    const product = { id: productId, name: "Product" };

    // Stores in global cache
    globalCache.set(productId, product);
    return product;
  }

  clearProductCache(): void {
    // Modifies global cache
    console.log("Clearing global product cache");
    globalCache.clear();
  }
}

// Common/Global Coupling - multiple global dependencies
export class OrderProcessor {
  processOrder(orderId: string): boolean {
    // Depends on global user session
    if (!globalUserSession.isAuthenticated) {
      console.log("User must be logged in to process orders");
      return false;
    }

    console.log(`Processing order ${orderId} for user ${globalUserSession.userId}`);

    // Depends on global configuration
    const apiUrl = globalConfig.apiUrl;
    console.log(`Posting to: ${apiUrl}/orders`);

    // Depends on global cache
    if (globalCache.has(orderId)) {
      console.log("Order found in global cache");
    }

    return true;
  }

  calculateShipping(): number {
    // Depends on global user session for user role
    if (globalUserSession.role === "premium") {
      return 0; // Free shipping for premium users
    }
    return 10; // Standard shipping
  }
}

// Common/Global Coupling - modifies global state
export class AuthService {
  login(username: string, password: string): boolean {
    // Simulated authentication
    if (password.length >= 8) {
      // Modifies global state!
      globalUserSession.userId = "USER-123";
      globalUserSession.username = username;
      globalUserSession.isAuthenticated = true;
      globalUserSession.role = "user";

      console.log(`User ${username} logged in - global session updated`);
      return true;
    }

    return false;
  }

  logout(): void {
    // Modifies global state!
    globalUserSession.userId = "";
    globalUserSession.username = "";
    globalUserSession.isAuthenticated = false;
    globalUserSession.role = "guest";

    console.log("User logged out - global session cleared");
  }

  promoteToAdmin(userId: string): void {
    // Modifies global state
    if (globalUserSession.userId === userId) {
      globalUserSession.role = "admin";
      console.log("User promoted to admin in global session");
    }
  }
}

// Usage showing the problem
const dashboard = new UserDashboard();
dashboard.displayDashboard(); // Depends on global session

const authService = new AuthService();
authService.login("john", "password123"); // Modifies global session

dashboard.displayDashboard(); // Now shows different content (hidden dependency!)

const apiClient = new ApiClient();
apiClient.fetchData("/products"); // Depends on global config

// Changing global config affects all instances
globalConfig.debugMode = true;
apiClient.fetchData("/products"); // Now shows debug info (hidden dependency!)

const productService = new ProductService();
productService.getProduct("PROD-1"); // Uses global cache

const orderProcessor = new OrderProcessor();
orderProcessor.processOrder("ORD-123"); // Depends on multiple globals!

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. What problems does global state create?
 * 3. How does changing global state affect different parts of the code?
 * 4. How would you refactor to eliminate global coupling?
 *
 * Hint: Think about dependency injection and passing dependencies explicitly
 */
