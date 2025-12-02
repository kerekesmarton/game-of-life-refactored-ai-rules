/**
 * Workshop Example 07
 * Analyze the cohesion type of this class and suggest improvements
 */

export class ResourceCleanup {
  shutdownApplication(): void {
    console.log("Beginning graceful shutdown...");

    this.flushPendingLogs();
    this.saveUserSessions();
    this.closeNetworkConnections();
    this.releaseFileHandles();
    this.clearTemporaryFiles();
    this.disconnectFromDatabase();

    console.log("Shutdown complete!");
  }

  private flushPendingLogs(): void {
    console.log("Flushing log buffers to disk");
    // Write any pending logs
  }

  private saveUserSessions(): void {
    console.log("Persisting active user sessions");
    // Save session state
  }

  private closeNetworkConnections(): void {
    console.log("Closing all network connections");
    // Close sockets and HTTP connections
  }

  private releaseFileHandles(): void {
    console.log("Releasing file system handles");
    // Close open files
  }

  private clearTemporaryFiles(): void {
    console.log("Deleting temporary files");
    // Clean up temp directory
  }

  private disconnectFromDatabase(): void {
    console.log("Closing database connections");
    // Disconnect from DB
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
