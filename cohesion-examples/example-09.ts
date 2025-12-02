/**
 * Workshop Example 09
 * Analyze the cohesion type of this class and suggest improvements
 */

type ExportFormat = "json" | "xml" | "csv" | "pdf";

interface UserData {
  id: string;
  name: string;
  email: string;
  age: number;
}

export class DataExporter {
  export(data: UserData[], format: ExportFormat): string {
    console.log(`Exporting data in ${format} format`);

    switch (format) {
      case "json":
        return this.exportAsJson(data);
      case "xml":
        return this.exportAsXml(data);
      case "csv":
        return this.exportAsCsv(data);
      case "pdf":
        return this.exportAsPdf(data);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private exportAsJson(data: UserData[]): string {
    console.log("Converting to JSON format");
    return JSON.stringify(data, null, 2);
  }

  private exportAsXml(data: UserData[]): string {
    console.log("Converting to XML format");
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<users>\n';

    for (const user of data) {
      xml += "  <user>\n";
      xml += `    <id>${user.id}</id>\n`;
      xml += `    <name>${user.name}</name>\n`;
      xml += `    <email>${user.email}</email>\n`;
      xml += `    <age>${user.age}</age>\n`;
      xml += "  </user>\n";
    }

    xml += "</users>";
    return xml;
  }

  private exportAsCsv(data: UserData[]): string {
    console.log("Converting to CSV format");
    let csv = "ID,Name,Email,Age\n";

    for (const user of data) {
      csv += `${user.id},"${user.name}",${user.email},${user.age}\n`;
    }

    return csv;
  }

  private exportAsPdf(data: UserData[]): string {
    console.log("Generating PDF document");
    // Simplified PDF generation
    let pdf = "PDF Document\n";
    pdf += "============\n\n";

    for (const user of data) {
      pdf += `User: ${user.name}\n`;
      pdf += `Email: ${user.email}\n`;
      pdf += `Age: ${user.age}\n\n`;
    }

    return pdf;
  }
}

/**
 * Questions for discussion:
 * 1. What type of cohesion does this class demonstrate?
 * 2. What are the characteristics that identify this cohesion type?
 * 3. Is this good or bad cohesion? Why?
 * 4. How would you improve this design?
 */
