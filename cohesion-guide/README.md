# Function Cohesion Workshop

## What is Cohesion?

**Cohesion** refers to how closely related and focused the responsibilities of a class or module are. High cohesion means a class has a clear, single purpose. Low cohesion means a class tries to do many unrelated things.

## Types of Cohesion

This workshop covers two categories: **Function Cohesion** and **Class Cohesion**.

### Function Cohesion (Best to Worst)

#### 1. Functional Cohesion ⭐⭐⭐⭐⭐ (BEST)
A function or class performs one single, specific task.
- **Example**: A `TaxCalculator` class that only calculates taxes
- **Goal**: Strive for this type of cohesion

#### 2. Sequential Cohesion ⭐⭐⭐⭐
Output from one function is used as input to the next function.
- **Example**: Data processing pipeline where each step transforms the output of the previous step
- **Characteristics**: Clear data flow, functions are ordered

#### 3. Communicational Cohesion ⭐⭐⭐
Two or more functions use the same data fields.
- **Example**: Multiple functions that all operate on the same customer data
- **Characteristics**: Shared data, but different purposes

#### 4. Procedural Cohesion ⭐⭐
Functions are related to one another by domain or use case.
- **Example**: CRUD operations (Create, Read, Update, Delete) on the same entity
- **Characteristics**: Related by procedure, not by data flow

#### 5. Temporal Cohesion ⭐
Multiple functions are related by timing - they all execute at the same time.
- **Example**: Initialization functions that all run at startup
- **Characteristics**: Only related by when they execute

#### 6. Logical Cohesion ⭐
Multiple functions where the logical order is determined by class input parameters.
- **Example**: A class with a switch statement that selects which operation to perform
- **Characteristics**: Control parameter determines behavior

#### 7. Coincidental Cohesion 💀 (WORST)
Functions have no clear purpose in being grouped together.
- **Example**: A "Utils" class with random, unrelated functions
- **Characteristics**: No meaningful relationship

### Class Cohesion Anti-Patterns 💀

These are class-level design problems that indicate poor cohesion:

#### 1. Mixed-Role Cohesion
Class manages unrelated same-level entities.
- **Example**: A class that manages both Users AND Orders
- **Problem**: Multiple unrelated responsibilities
- **Solution**: Split into separate repositories/managers, create coordinator if needed

#### 2. Mixed-Domain Cohesion
Class spans multiple architectural layers (domain/data/presentation).
- **Example**: A domain model with database operations and UI formatting
- **Problem**: Violates Separation of Concerns
- **Solution**: Separate into layers (domain, repository, formatter)

#### 3. Mixed-Instance Cohesion
Different instances use different subsets of fields/methods.
- **Example**: A `Vehicle` class where Car instances use different fields than Boat instances
- **Problem**: Optional fields, runtime type checking, wasted memory
- **Solution**: Split into separate classes per type (inheritance or composition)

---

## Workshop Instructions

### Your Task
1. Your group has been assigned one example file
2. Analyze the code and answer these questions:
   - **What type of cohesion does this demonstrate?**
   - **What are the identifying characteristics?**
   - **Is this good or bad cohesion? Why?**
   - **How would you improve this design?**

### Time Allocation
- **10-15 minutes**: Analyze your example as a group
- **3-5 minutes**: Prepare to present your findings
- **3 minutes**: Present to the larger group

### Tips for Analysis
1. Read the code carefully
2. Look at how functions relate to each other
3. Identify what the functions have in common (if anything)
4. Consider: "What would I name this class?"
5. Think about testing: "How easy would this be to test?"

### Discussion Questions

**Identification**
- Do the functions share data?
- Do they pass output to each other?
- Are they executed at the same time?
- Is there a control parameter determining behavior?
- Are they completely unrelated?

**Quality Assessment**
- Does the class have a clear, single purpose?
- How many reasons would this class have to change?
- Could you explain what this class does in one sentence?

**Improvement Strategies**
- Should functions be separated into different classes?
- Could you use design patterns (Strategy, Command, etc.)?
- Are there hidden responsibilities that should be extracted?
- Would splitting improve testability and maintainability?

---

## Example File Mapping

Each group will receive one of these files:

### Function Cohesion Examples (1-10)
- `example-01.ts` - Sequential Cohesion
- `example-02.ts` - Communicational Cohesion
- `example-03.ts` - Communicational Cohesion
- `example-04.ts` - Procedural Cohesion
- `example-05.ts` - Procedural Cohesion
- `example-06.ts` - Temporal Cohesion
- `example-07.ts` - Temporal Cohesion
- `example-08.ts` - Logical Cohesion
- `example-09.ts` - Logical Cohesion
- `example-10.ts` - Coincidental Cohesion

### Class Cohesion Examples (11-16)
- `example-11.ts` - Mixed-Role Cohesion (User + Order)
- `example-12.ts` - Mixed-Role Cohesion (Auth + Email)
- `example-13.ts` - Mixed-Domain Cohesion (Domain + Data + UI)
- `example-14.ts` - Mixed-Domain Cohesion (All layers)
- `example-15.ts` - Mixed-Instance Cohesion (Vehicles)
- `example-16.ts` - Mixed-Instance Cohesion (Employees)

Each file contains:
- A complete, runnable TypeScript class
- Comments with discussion questions
- A realistic scenario that demonstrates one cohesion type

---

## Key Principles to Remember

### Signs of Good Cohesion
✅ Easy to name the class meaningfully
✅ Easy to test in isolation
✅ Single reason to change
✅ Clear, focused responsibility
✅ High reusability

### Signs of Poor Cohesion

**Function-Level:**
❌ Generic names (Utils, Helper, Manager, Handler)
❌ Hard to describe what it does
❌ Switch statements determining behavior
❌ Functions grouped only by timing
❌ Completely unrelated operations

**Class-Level:**
❌ Class name contains "And", "Or", "Manager"
❌ Multiple unrelated data stores in one class
❌ Domain models with `save()`, `update()`, SQL queries
❌ Business logic mixed with HTTP calls or UI formatting
❌ Many optional fields (`field?: Type`)
❌ Methods that throw errors for wrong types
❌ Each instance uses < 50% of available fields

### Guidelines
1. **Strive for functional cohesion** - One class, one responsibility
2. **Sequential cohesion is acceptable** - Clear data flow is good
3. **Communicational cohesion is a warning** - Consider splitting by responsibility
4. **Procedural cohesion is common but problematic** - Separate concerns
5. **Avoid temporal and logical cohesion** - These are anti-patterns
6. **Never use coincidental cohesion** - This is always wrong

---

## Connection to Other Principles

### Single Responsibility Principle (SRP)
Cohesion is directly related to SRP. High cohesion means each class has a single, well-defined responsibility.

### Tell, Don't Ask
Good cohesion often means objects manage their own data and behavior, rather than asking for data and operating on it externally.

### KISS (Keep It Simple, Stupid)
High cohesion leads to simpler, more understandable code. Each class does one thing well.

---

## After the Workshop

### Reflect on Your Codebase
- Look for "Utils" or "Helper" classes in your projects
- Identify classes with switch statements
- Find classes that are hard to name or explain
- Notice classes with multiple reasons to change

### Practice Recognition
- When reviewing code, ask: "What type of cohesion is this?"
- When writing code, ask: "Does this function belong here?"
- When naming classes, if you struggle, consider if cohesion is the problem

### Incremental Improvement
You don't need to fix everything at once. When you touch a class:
1. Recognize the cohesion type
2. Consider if low cohesion is causing problems
3. If it's causing issues, refactor opportunistically
4. Follow the Boy Scout Rule: Leave code better than you found it

---

## Resources

### Further Reading
- "Clean Code" by Robert C. Martin (Chapter 10: Classes)
- "Code Complete" by Steve McConnell (Chapter 7: High-Quality Routines)
- "Refactoring" by Martin Fowler

### Related Concepts
- Single Responsibility Principle
- Interface Segregation Principle
- Separation of Concerns
- Coupling and Cohesion

---

## Questions?

During the workshop, feel free to:
- Ask the facilitator for clarification
- Discuss with your group
- Challenge the examples (there's always room for interpretation!)
- Share experiences from your own codebase

Remember: The goal is not to memorize definitions, but to recognize patterns and improve your design instincts.

**Good luck with your analysis!**
