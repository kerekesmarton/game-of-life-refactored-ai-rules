/**
 * Workshop Example 11 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  userId: string;
  items: string[];
  total: number;
}

export class UserOrderManager {
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();

  // User-related operations
  createUser(name: string, email: string): User {
    const user: User = {
      id: `USER-${Date.now()}`,
      name,
      email,
    };
    this.users.set(user.id, user);
    console.log(`User created: ${user.id}`);
    return user;
  }

  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  updateUserEmail(userId: string, newEmail: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.email = newEmail;
    console.log(`Updated email for user ${userId}`);
    return true;
  }

  deleteUser(userId: string): boolean {
    if (!this.users.has(userId)) return false;

    this.users.delete(userId);
    console.log(`User deleted: ${userId}`);
    return true;
  }

  // Order-related operations
  createOrder(userId: string, items: string[], total: number): Order | null {
    if (!this.users.has(userId)) {
      console.log("Cannot create order: user not found");
      return null;
    }

    const order: Order = {
      id: `ORDER-${Date.now()}`,
      userId,
      items,
      total,
    };
    this.orders.set(order.id, order);
    console.log(`Order created: ${order.id}`);
    return order;
  }

  getOrder(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  cancelOrder(orderId: string): boolean {
    if (!this.orders.has(orderId)) return false;

    this.orders.delete(orderId);
    console.log(`Order cancelled: ${orderId}`);
    return true;
  }

  getUserOrders(userId: string): Order[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  // Mixed operations
  getUserWithOrders(userId: string): { user: User | null; orders: Order[] } {
    const user = this.getUser(userId);
    const orders = this.getUserOrders(userId);
    return { user, orders };
  }

  deleteUserAndOrders(userId: string): boolean {
    const orders = this.getUserOrders(userId);
    orders.forEach((order) => this.cancelOrder(order.id));
    return this.deleteUser(userId);
  }
}

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What are the identifying characteristics?
 * 3. What problems does this design create?
 * 4. How would you improve this design?
 *
 * Hint: Look at what different types of objects this class manages
 */
