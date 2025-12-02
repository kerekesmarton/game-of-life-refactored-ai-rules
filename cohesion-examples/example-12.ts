/**
 * Workshop Example 12 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

interface AuthToken {
  token: string;
  expiresAt: Date;
}

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export class AuthenticationEmailService {
  private sessions: Map<string, AuthToken> = new Map();
  private emailQueue: EmailMessage[] = [];

  // Authentication operations
  login(username: string, password: string): AuthToken | null {
    console.log(`Attempting login for: ${username}`);

    // Simulate password check
    if (password.length < 8) {
      console.log("Login failed: invalid credentials");
      return null;
    }

    const token: AuthToken = {
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    };

    this.sessions.set(username, token);
    console.log(`Login successful for: ${username}`);

    return token;
  }

  logout(username: string): void {
    this.sessions.delete(username);
    console.log(`User logged out: ${username}`);
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
    console.log(`Token refreshed for: ${username}`);
    return newToken;
  }

  // Email operations
  sendEmail(to: string, subject: string, body: string): void {
    const message: EmailMessage = { to, subject, body };
    this.emailQueue.push(message);
    console.log(`Email queued to: ${to}`);
  }

  sendWelcomeEmail(email: string, username: string): void {
    this.sendEmail(
      email,
      "Welcome!",
      `Hello ${username}, welcome to our platform!`
    );
  }

  sendPasswordResetEmail(email: string, resetToken: string): void {
    this.sendEmail(
      email,
      "Password Reset",
      `Click here to reset your password: https://example.com/reset?token=${resetToken}`
    );
  }

  sendLoginNotification(email: string, ipAddress: string): void {
    this.sendEmail(
      email,
      "New Login Detected",
      `A new login was detected from IP: ${ipAddress}`
    );
  }

  processEmailQueue(): void {
    console.log(`Processing ${this.emailQueue.length} emails`);

    this.emailQueue.forEach((email) => {
      console.log(`Sending email to ${email.to}: ${email.subject}`);
      // Simulate SMTP sending
    });

    this.emailQueue = [];
  }

  // Mixed operations
  loginAndNotify(username: string, password: string, email: string): AuthToken | null {
    const token = this.login(username, password);

    if (token) {
      this.sendLoginNotification(email, "192.168.1.1");
    }

    return token;
  }

  private generateToken(): string {
    return `TOKEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What are the identifying characteristics?
 * 3. What problems does this design create?
 * 4. How would you improve this design?
 *
 * Hint: Look at the different responsibilities this class handles
 */
