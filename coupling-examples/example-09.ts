/**
 * Workshop Example 09 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Content/Pathological Coupling - one object manipulates another's internals
export class BankAccount {
  balance: number; // Public field - should be private!
  transactions: Array<{ amount: number; date: Date }>; // Public - should be private!
  accountNumber: string;
  isLocked: boolean; // Public - should be private!

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.transactions = [];
    this.isLocked = false;
  }

  // No proper methods for manipulating state
}

// Content Coupling - directly manipulates BankAccount internals
export class TransferService {
  transfer(from: BankAccount, to: BankAccount, amount: number): void {
    // Directly accessing and modifying another object's internal state!
    console.log(`Transferring $${amount}`);

    // Reaches into 'from' account's internals
    if (from.balance >= amount) {
      from.balance -= amount; // Direct field manipulation!
      from.transactions.push({
        // Direct array manipulation!
        amount: -amount,
        date: new Date(),
      });

      // Reaches into 'to' account's internals
      to.balance += amount; // Direct field manipulation!
      to.transactions.push({
        // Direct array manipulation!
        amount: amount,
        date: new Date(),
      });

      console.log(`Transfer complete. From balance: $${from.balance}`);
    } else {
      console.log("Insufficient funds");
    }
  }
}

// Content Coupling - manipulates account state directly
export class AccountManager {
  lockAccount(account: BankAccount): void {
    // Directly manipulates internal state
    account.isLocked = true;
    console.log(`Account ${account.accountNumber} locked`);
  }

  unlockAccount(account: BankAccount): void {
    // Directly manipulates internal state
    account.isLocked = false;
    console.log(`Account ${account.accountNumber} unlocked`);
  }

  adjustBalance(account: BankAccount, adjustment: number): void {
    // Directly manipulates balance without any validation!
    account.balance += adjustment;

    // Directly manipulates transactions array
    account.transactions.push({
      amount: adjustment,
      date: new Date(),
    });

    console.log(`Balance adjusted by $${adjustment}. New balance: $${account.balance}`);
  }

  clearTransactionHistory(account: BankAccount): void {
    // Directly clears internal array
    account.transactions = [];
    console.log("Transaction history cleared");
  }
}

// Content Coupling - another class that reaches into BankAccount
export class FraudDetector {
  checkForFraud(account: BankAccount): boolean {
    // Directly reads internal transaction array
    const recentTransactions = account.transactions.slice(-10);

    let suspiciousCount = 0;
    for (const transaction of recentTransactions) {
      if (Math.abs(transaction.amount) > 1000) {
        suspiciousCount++;
      }
    }

    if (suspiciousCount > 5) {
      // Directly modifies internal state!
      account.isLocked = true;
      console.log("Fraud detected! Account automatically locked");
      return true;
    }

    return false;
  }

  reverseLastTransaction(account: BankAccount): void {
    // Directly manipulates internal arrays and balance
    const lastTransaction = account.transactions.pop(); // Removes from internal array!

    if (lastTransaction) {
      account.balance -= lastTransaction.amount; // Directly modifies balance!
      console.log(`Reversed transaction of $${lastTransaction.amount}`);
    }
  }
}

// Content Coupling - report generator reaching into internals
export class AccountReportGenerator {
  generateReport(account: BankAccount): string {
    // Directly accesses all internal fields
    let report = `Account Report for ${account.accountNumber}\n`;
    report += `Balance: $${account.balance}\n`;
    report += `Status: ${account.isLocked ? "LOCKED" : "ACTIVE"}\n`;
    report += `\nTransaction History:\n`;

    // Directly iterates over internal transaction array
    for (const transaction of account.transactions) {
      report += `  ${transaction.date.toLocaleDateString()}: $${transaction.amount}\n`;
    }

    return report;
  }

  calculateAverageTransaction(account: BankAccount): number {
    // Directly accesses internal transaction array
    if (account.transactions.length === 0) return 0;

    const sum = account.transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return sum / account.transactions.length;
  }
}

// Usage showing the problem
const account1 = new BankAccount("ACC-001", 1000);
const account2 = new BankAccount("ACC-002", 500);

const transferService = new TransferService();
transferService.transfer(account1, account2, 200); // Manipulates internals!

const manager = new AccountManager();
manager.adjustBalance(account1, 100); // Direct field manipulation!
manager.lockAccount(account1); // Direct field manipulation!

const fraudDetector = new FraudDetector();
fraudDetector.reverseLastTransaction(account1); // Manipulates internals!

// The problem: Anyone can do anything to the account
account1.balance = 9999999; // Danger! Direct field access!
account1.transactions = []; // Danger! Can clear history!
account1.isLocked = false; // Danger! Can unlock!

console.log(`Account balance: $${account1.balance}`); // Who knows if it's valid?

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. Why is this the worst type of coupling?
 * 3. What problems does this create?
 * 4. How would you refactor to eliminate content coupling?
 *
 * Hint: Think about encapsulation and the principle "Tell, Don't Ask"
 */
