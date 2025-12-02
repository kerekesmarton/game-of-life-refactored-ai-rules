/**
 * Workshop Example 08 - COUPLING
 * Analyze the coupling type demonstrated in this code
 */

// Global application state
const AppState = {
  currentTheme: "light" as "light" | "dark",
  currentLanguage: "en" as string,
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
  },
  userPreferences: {
    notificationsEnabled: true,
    emailFrequency: "daily",
    autoSave: true,
  },
};

// Global counters
let requestCounter = 0;
let errorCounter = 0;
let successCounter = 0;

// Global logger configuration
const LoggerConfig = {
  level: "info" as "debug" | "info" | "warn" | "error",
  destination: "console" as "console" | "file",
  includeTimestamp: true,
};

// Common/Global Coupling - depends on AppState
export class UIRenderer {
  render(): void {
    // Directly accesses global AppState
    console.log(`Rendering UI in ${AppState.currentTheme} theme`);
    console.log(`Language: ${AppState.currentLanguage}`);

    if (AppState.featureFlags.enableNewUI) {
      console.log("Using new UI components");
    } else {
      console.log("Using legacy UI components");
    }
  }

  getThemeColors(): { bg: string; text: string } {
    // Depends on global theme setting
    if (AppState.currentTheme === "dark") {
      return { bg: "#000", text: "#fff" };
    }
    return { bg: "#fff", text: "#000" };
  }
}

// Common/Global Coupling - depends on and modifies global counters
export class RequestHandler {
  handleRequest(endpoint: string): void {
    // Modifies global counter
    requestCounter++;
    console.log(`Request #${requestCounter} to ${endpoint}`);

    // Simulated request handling
    const success = Math.random() > 0.2;

    if (success) {
      // Modifies global counter
      successCounter++;
      console.log(`Success! Total successes: ${successCounter}`);
    } else {
      // Modifies global counter
      errorCounter++;
      console.log(`Error! Total errors: ${errorCounter}`);
    }
  }

  getStatistics(): { total: number; success: number; errors: number } {
    // Reads global counters
    return {
      total: requestCounter,
      success: successCounter,
      errors: errorCounter,
    };
  }

  resetStatistics(): void {
    // Modifies global counters
    requestCounter = 0;
    successCounter = 0;
    errorCounter = 0;
    console.log("Statistics reset");
  }
}

// Common/Global Coupling - depends on LoggerConfig
export class Logger {
  log(message: string, level: "debug" | "info" | "warn" | "error"): void {
    // Depends on global LoggerConfig
    const configLevel = LoggerConfig.level;
    const levels = ["debug", "info", "warn", "error"];

    if (levels.indexOf(level) >= levels.indexOf(configLevel)) {
      const timestamp = LoggerConfig.includeTimestamp
        ? new Date().toISOString()
        : "";
      const output = `${timestamp} [${level.toUpperCase()}] ${message}`;

      if (LoggerConfig.destination === "console") {
        console.log(output);
      } else {
        console.log(`Writing to file: ${output}`);
      }
    }
  }

  debug(message: string): void {
    this.log(message, "debug");
  }

  info(message: string): void {
    this.log(message, "info");
  }

  warn(message: string): void {
    this.log(message, "warn");
  }

  error(message: string): void {
    this.log(message, "error");
  }
}

// Common/Global Coupling - depends on feature flags
export class FeatureManager {
  isFeatureEnabled(featureName: string): boolean {
    // Directly accesses global feature flags
    switch (featureName) {
      case "newUI":
        return AppState.featureFlags.enableNewUI;
      case "beta":
        return AppState.featureFlags.enableBetaFeatures;
      case "analytics":
        return AppState.featureFlags.enableAnalytics;
      default:
        return false;
    }
  }

  executeIfEnabled(featureName: string, callback: () => void): void {
    // Depends on global state
    if (this.isFeatureEnabled(featureName)) {
      callback();
    } else {
      console.log(`Feature ${featureName} is disabled`);
    }
  }
}

// Common/Global Coupling - depends on user preferences
export class NotificationManager {
  sendNotification(message: string): void {
    // Depends on global user preferences
    if (AppState.userPreferences.notificationsEnabled) {
      console.log(`Notification: ${message}`);
    } else {
      console.log("Notifications are disabled in preferences");
    }
  }

  shouldSendEmail(): boolean {
    // Depends on global preferences
    return AppState.userPreferences.emailFrequency !== "never";
  }

  autoSaveEnabled(): boolean {
    // Depends on global preferences
    return AppState.userPreferences.autoSave;
  }
}

// Common/Global Coupling - multiple global dependencies
export class Application {
  initialize(): void {
    console.log("Initializing application...");

    // Depends on global AppState
    console.log(`Theme: ${AppState.currentTheme}`);
    console.log(`Language: ${AppState.currentLanguage}`);

    // Depends on global LoggerConfig
    console.log(`Log level: ${LoggerConfig.level}`);

    // Reads global counters
    console.log(`Request counter starts at: ${requestCounter}`);
  }

  changeTheme(theme: "light" | "dark"): void {
    // Modifies global state
    AppState.currentTheme = theme;
    console.log(`Theme changed to ${theme} globally`);
  }

  enableDebugMode(): void {
    // Modifies global logger config
    LoggerConfig.level = "debug";
    console.log("Debug mode enabled globally");
  }
}

// Usage showing the problem
const ui = new UIRenderer();
ui.render(); // Shows light theme

const app = new Application();
app.changeTheme("dark"); // Modifies global state

ui.render(); // Now shows dark theme (hidden dependency!)

const logger = new Logger();
logger.debug("This won't show"); // Log level is 'info'

app.enableDebugMode(); // Modifies global config

logger.debug("Now this shows!"); // Same logger, different behavior!

const requestHandler = new RequestHandler();
requestHandler.handleRequest("/api/users"); // Increments global counters

const featureManager = new FeatureManager();
if (featureManager.isFeatureEnabled("analytics")) {
  // Depends on global feature flags
  console.log("Analytics enabled");
}

// Modifying global state affects everything
AppState.featureFlags.enableNewUI = true;
ui.render(); // Now renders differently!

/**
 * Questions for discussion:
 * 1. What type of coupling is demonstrated here?
 * 2. How many global variables are being accessed?
 * 3. What makes this code hard to test?
 * 4. How would you refactor to eliminate global dependencies?
 *
 * Hint: Consider how to make dependencies explicit and testable
 */
