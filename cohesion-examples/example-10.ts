/**
 * Workshop Example 10
 * Analyze the cohesion type of this class and suggest improvements
 */

export class HelperUtils {
  calculateTax(amount: number, rate: number): number {
    console.log(`Calculating tax for amount: ${amount}`);
    return amount * rate;
  }

  validateEmail(email: string): boolean {
    console.log(`Validating email: ${email}`);
    return email.includes("@") && email.includes(".");
  }

  generateRandomColor(): string {
    console.log("Generating random color");
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  sortArrayDescending(arr: number[]): number[] {
    console.log("Sorting array in descending order");
    return [...arr].sort((a, b) => b - a);
  }

  getCurrentWeather(): string {
    console.log("Fetching weather data");
    // Simulated weather API call
    return "Sunny, 72°F";
  }

  encryptPassword(password: string): string {
    console.log("Encrypting password");
    // Simplified encryption
    return Buffer.from(password).toString("base64");
  }

  calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    console.log(`Calculating distance between (${x1},${y1}) and (${x2},${y2})`);
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  formatPhoneNumber(phone: string): string {
    console.log(`Formatting phone number: ${phone}`);
    const cleaned = phone.replace(/\D/g, "");
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  isPrime(n: number): boolean {
    console.log(`Checking if ${n} is prime`);
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  convertToUpperCase(text: string): string {
    console.log(`Converting text to uppercase: ${text}`);
    return text.toUpperCase();
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
