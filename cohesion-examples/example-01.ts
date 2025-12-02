/**
 * Workshop Example 01
 * Analyze the cohesion type of this class and suggest improvements
 */

export class ImageProcessor {
  processImage(imagePath: string): string {
    const rawData = this.loadImage(imagePath);
    const validated = this.validateImageData(rawData);
    const resized = this.resizeImage(validated);
    const compressed = this.compressImage(resized);
    const outputPath = this.saveImage(compressed);
    return outputPath;
  }

  private loadImage(path: string): Buffer {
    // Load image from file system
    console.log(`Loading image from ${path}`);
    return Buffer.from("image-data");
  }

  private validateImageData(data: Buffer): Buffer {
    // Validate image format and dimensions
    console.log("Validating image data");
    return data;
  }

  private resizeImage(data: Buffer): Buffer {
    // Resize to target dimensions
    console.log("Resizing image");
    return data;
  }

  private compressImage(data: Buffer): Buffer {
    // Apply compression algorithm
    console.log("Compressing image");
    return data;
  }

  private saveImage(data: Buffer): string {
    // Save to output location
    const outputPath = "/output/processed-image.jpg";
    console.log(`Saving image to ${outputPath}`);
    return outputPath;
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
