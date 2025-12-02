/**
 * Workshop Example 15 - CLASS COHESION
 * Analyze the cohesion type of this class and suggest improvements
 */

type VehicleType = "car" | "boat" | "plane";

export class Vehicle {
  // Common fields
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;

  // Car-specific fields
  numberOfDoors?: number;
  engineType?: "gasoline" | "diesel" | "electric";
  transmission?: "manual" | "automatic";

  // Boat-specific fields
  hullType?: "monohull" | "catamaran" | "trimaran";
  sailArea?: number;
  hasMotor?: boolean;

  // Plane-specific fields
  wingSpan?: number;
  maxAltitude?: number;
  numberOfEngines?: number;
  passengerCapacity?: number;

  constructor(type: VehicleType, brand: string, model: string, year: number) {
    this.id = `VEH-${Date.now()}`;
    this.type = type;
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  // Car-specific methods
  setCarDetails(
    doors: number,
    engineType: "gasoline" | "diesel" | "electric",
    transmission: "manual" | "automatic"
  ): void {
    if (this.type !== "car") {
      console.log("Error: This method is only for cars!");
      return;
    }

    this.numberOfDoors = doors;
    this.engineType = engineType;
    this.transmission = transmission;
  }

  shiftGear(gear: number): void {
    if (this.type !== "car") {
      console.log("Error: Only cars have gears!");
      return;
    }

    console.log(`Shifting to gear ${gear}`);
  }

  // Boat-specific methods
  setBoatDetails(
    hullType: "monohull" | "catamaran" | "trimaran",
    sailArea: number,
    hasMotor: boolean
  ): void {
    if (this.type !== "boat") {
      console.log("Error: This method is only for boats!");
      return;
    }

    this.hullType = hullType;
    this.sailArea = sailArea;
    this.hasMotor = hasMotor;
  }

  adjustSails(angle: number): void {
    if (this.type !== "boat") {
      console.log("Error: Only boats have sails!");
      return;
    }

    console.log(`Adjusting sails to ${angle} degrees`);
  }

  dropAnchor(): void {
    if (this.type !== "boat") {
      console.log("Error: Only boats have anchors!");
      return;
    }

    console.log("Anchor dropped");
  }

  // Plane-specific methods
  setPlaneDetails(
    wingSpan: number,
    maxAltitude: number,
    numberOfEngines: number,
    passengerCapacity: number
  ): void {
    if (this.type !== "plane") {
      console.log("Error: This method is only for planes!");
      return;
    }

    this.wingSpan = wingSpan;
    this.maxAltitude = maxAltitude;
    this.numberOfEngines = numberOfEngines;
    this.passengerCapacity = passengerCapacity;
  }

  takeoff(): void {
    if (this.type !== "plane") {
      console.log("Error: Only planes can take off!");
      return;
    }

    console.log("Taking off...");
  }

  adjustAltitude(altitude: number): void {
    if (this.type !== "plane") {
      console.log("Error: Only planes have altitude!");
      return;
    }

    if (this.maxAltitude && altitude > this.maxAltitude) {
      console.log(`Cannot exceed max altitude of ${this.maxAltitude}ft`);
      return;
    }

    console.log(`Adjusting altitude to ${altitude}ft`);
  }

  // Mixed methods that try to handle all types
  getCapacity(): number {
    switch (this.type) {
      case "car":
        return this.numberOfDoors ? this.numberOfDoors + 1 : 5;
      case "boat":
        return 10; // Arbitrary
      case "plane":
        return this.passengerCapacity || 0;
      default:
        return 0;
    }
  }

  describe(): string {
    let description = `${this.year} ${this.brand} ${this.model}`;

    if (this.type === "car") {
      description += ` - ${this.numberOfDoors} doors, ${this.engineType} engine`;
    } else if (this.type === "boat") {
      description += ` - ${this.hullType}, ${this.sailArea}m² sail area`;
    } else if (this.type === "plane") {
      description += ` - ${this.wingSpan}m wingspan, ${this.numberOfEngines} engines`;
    }

    return description;
  }

  performMaintenance(): void {
    console.log(`Performing maintenance on ${this.type}`);

    if (this.type === "car" && this.engineType) {
      console.log(`Checking ${this.engineType} engine`);
    } else if (this.type === "boat" && this.sailArea) {
      console.log(`Inspecting ${this.sailArea}m² of sails`);
    } else if (this.type === "plane" && this.numberOfEngines) {
      console.log(`Inspecting ${this.numberOfEngines} engines`);
    }
  }
}

// Usage examples showing the problem
const car = new Vehicle("car", "Toyota", "Camry", 2023);
car.setCarDetails(4, "gasoline", "automatic");
car.shiftGear(3); // Works fine

const boat = new Vehicle("boat", "Beneteau", "Oceanis", 2022);
boat.setBoatDetails("monohull", 45, true);
boat.shiftGear(3); // ERROR! Boats don't have gears

const plane = new Vehicle("plane", "Cessna", "172", 2021);
plane.setPlaneDetails(11, 14000, 1, 4);
plane.dropAnchor(); // ERROR! Planes don't have anchors

/**
 * Questions for discussion:
 * 1. What type of class cohesion issue does this demonstrate?
 * 2. What problems occur when different instances use different fields?
 * 3. What are the code smells you can identify?
 * 4. How would you improve this design?
 *
 * Hint: Look at which fields and methods are used by which vehicle types
 */
