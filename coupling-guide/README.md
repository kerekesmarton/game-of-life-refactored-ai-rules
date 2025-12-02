# Coupling Workshop

## What is Coupling?

**Coupling** refers to the degree of interdependence between software modules. Low coupling means modules are independent and can be changed without affecting others. High coupling means modules are tightly connected and changes ripple through the system.

## Types of Coupling (Best to Worst)

### Interaction Coupling

#### 1. Data Coupling ⭐⭐⭐⭐⭐ (BEST)
Pass only what's needed; all passed data is used.
- **Example**: `calculateTax(price: number, rate: number)`
- **Characteristics**: Minimal dependencies, pass primitives or objects where all fields are used
- **Goal**: Strive for this type of coupling

#### 2. Stamp Coupling ⭐⭐⭐
Pass a composite object but only use part of it.
- **Example**: Pass entire `User` object just to use `email` field
- **Problem**: Creates unnecessary dependencies, harder to test
- **Solution**: Pass only the specific field needed

#### 3. Control Coupling ⭐⭐
Pass a parameter that controls execution flow.
- **Example**: `processData(data, shouldValidate: boolean, shouldTransform: boolean)`
- **Problem**: Caller controls internal logic, leads to complex conditionals
- **Solution**: Use separate methods or polymorphism

#### 4. Common/Global Coupling ⭐
Depend on global or shared data.
- **Example**: Accessing `globalConfig` or `globalUserSession`
- **Problem**: Hidden dependencies, hard to test, not thread-safe
- **Solution**: Use dependency injection

#### 5. Content/Pathological Coupling 💀 (WORST)
One object reaches into another's internals.
- **Example**: `account.balance += 100` (direct field manipulation)
- **Problem**: Violates encapsulation, can create invalid state
- **Solution**: Use methods ("Tell, Don't Ask")

### Inheritance Coupling ⚠️

#### 6. Inheritance Coupling
Strongest form of coupling through inheritance.
- **When to use**: Only for true "is-a-kind-of" relationships
- **Problem**: Tight coupling - changes in parent affect all children
- **Solution**: Prefer composition over inheritance

---

## Key Principles

1. **Aim for Data Coupling** - Pass only what's needed
2. **Avoid Stamp Coupling** - If only using part of object, pass that part
3. **Never use Control Coupling** - Use polymorphism or separate methods
4. **Eliminate Global Coupling** - Pass dependencies explicitly
5. **Never use Content Coupling** - Respect encapsulation
6. **Composition over Inheritance** - Use inheritance only for specialization

**Golden Rule**: Objects should tell other objects what to do, not reach into them and do it themselves.

---

## Workshop Instructions

### Your Task
1. Your group has been assigned one example file
2. Analyze the code and answer these questions:
   - **What type of coupling does this demonstrate?**
   - **What are the identifying characteristics?**
   - **What problems does this coupling create?**
   - **How would you refactor to reduce coupling?**

### Time Allocation
- **10-15 minutes**: Analyze your example as a group
- **3-5 minutes**: Prepare to present your findings
- **3 minutes**: Present to the larger group

### Tips for Analysis
1. Identify all dependencies (what does this code depend on?)
2. Are dependencies explicit or hidden?
3. What would break if you changed one module?
4. Can you test this code in isolation?
5. How many modules need to know about this module's internals?

### Discussion Questions

**Dependency Analysis**
- What does this module depend on?
- Are the dependencies passed as parameters or accessed globally?
- Can you see all dependencies by looking at the method signature?

**Change Impact**
- If module A changes, what else must change?
- How many files would you need to modify?
- Can you change implementation without breaking clients?

**Testing**
- Can you test this in isolation?
- What do you need to mock/stub?
- Are tests simple or complex?

**Reusability**
- Can you reuse this module in a different context?
- What prevents reuse?
- How many assumptions does it make?

---

## Example File Mapping

Each group will receive one of these files:

### Good Coupling (Examples 1-2)
- `example-01.ts` - Data Coupling (passing primitives, all data used)
- `example-02.ts` - Data Coupling (focused objects, all fields used)

### Stamp Coupling (Examples 3-4)
- `example-03.ts` - Stamp Coupling (passing large User object, using small part)
- `example-04.ts` - Stamp Coupling (passing large Order object, using fragments)

### Control Coupling (Examples 5-6)
- `example-05.ts` - Control Coupling (format/mode/action parameters)
- `example-06.ts` - Control Coupling (operation types, boolean flags)

### Common/Global Coupling (Examples 7-8)
- `example-07.ts` - Common/Global Coupling (global session, config, cache)
- `example-08.ts` - Common/Global Coupling (global app state, counters, config)

### Content/Pathological Coupling (Examples 9-10)
- `example-09.ts` - Content Coupling (manipulating BankAccount internals)
- `example-10.ts` - Content Coupling (manipulating ShoppingCart internals)

### Inheritance Coupling (Examples 11-12)
- `example-11.ts` - Inheritance Coupling (Stack extends ArrayList - wrong!)
- `example-12.ts` - Inheritance Coupling (deep hierarchies, composition alternative)

Each file contains:
- A complete, runnable TypeScript example
- Comments with discussion questions
- Realistic scenarios demonstrating the coupling type

---

## Signs to Look For

### High Coupling (BAD)
❌ Passing large objects and using only 1-2 fields
❌ Boolean flags that control execution
❌ Accessing global variables or singletons
❌ Public fields being modified directly
❌ Long inheritance chains
❌ Methods with many parameters
❌ Hard to test in isolation

### Low Coupling (GOOD)
✅ Passing only what's needed
✅ Dependencies passed as parameters
✅ Private fields with public methods
✅ Objects managing their own state
✅ Composition over inheritance
✅ Easy to test with mocks
✅ Changes don't ripple through system

---

## Refactoring Patterns

### Tell, Don't Ask
❌ **Bad**: `if (account.balance > 100) { account.balance -= 100; }`
✅ **Good**: `account.withdraw(100)`

### Dependency Injection
❌ **Bad**: `class Service { fetch() { use(globalConfig); } }`
✅ **Good**: `class Service { constructor(private config) { } }`

### Composition Over Inheritance
❌ **Bad**: `class Stack extends ArrayList { }`
✅ **Good**: `class Stack { private items: T[] = []; }`

### Pass Specific Data
❌ **Bad**: `sendEmail(user: User)` using only `user.email`
✅ **Good**: `sendEmail(email: string)`

### Separate Methods
❌ **Bad**: `process(data, mode: "fast" | "slow")`
✅ **Good**: `processFast(data)` and `processSlow(data)`

---

## Connection to Other Principles

### Single Responsibility Principle (SRP)
Low coupling supports SRP - modules with single responsibility have fewer dependencies.

### Open/Closed Principle (OCP)
Low coupling enables OCP - can extend behavior without modifying existing code.

### Dependency Inversion Principle (DIP)
Depend on abstractions (interfaces) not concrete implementations - reduces coupling.

### Law of Demeter
"Don't talk to strangers" - reduces content coupling by limiting object interactions.

---

## After the Workshop

### Reflect on Your Codebase
- Look for global variables and singletons
- Find methods with boolean flag parameters
- Identify public fields that should be private
- Notice where inheritance is used for code reuse
- Find methods that pass large objects but use small parts

### Practice Recognition
- When reviewing code, ask: "What type of coupling is this?"
- When writing code, ask: "Am I creating unnecessary dependencies?"
- When testing is hard, ask: "Is this due to high coupling?"

### Incremental Improvement
1. **Start with Content Coupling** - Make fields private, add methods
2. **Fix Global Coupling** - Use dependency injection
3. **Eliminate Control Coupling** - Use separate methods or polymorphism
4. **Reduce Stamp Coupling** - Pass only what's needed
5. **Review Inheritance** - Consider composition alternatives

---

## Resources

### Further Reading
- "Clean Code" by Robert C. Martin
- "Effective Java" by Joshua Bloch (Item 16: Favor composition over inheritance)
- "Design Patterns" by Gang of Four
- "Working Effectively with Legacy Code" by Michael Feathers

### Related Concepts
- Dependency Injection
- Inversion of Control (IoC)
- SOLID Principles
- Law of Demeter
- Tell, Don't Ask

---

## Questions?

During the workshop, feel free to:
- Ask the facilitator for clarification
- Discuss with your group
- Share experiences from your own codebase
- Question the examples (there's always context!)

Remember: The goal is to recognize coupling patterns and understand their trade-offs, not to achieve zero coupling (which is impossible).

**Good luck with your analysis!**
