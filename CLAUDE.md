# Development Guidelines for Claude Code

This codebase follows a comprehensive set of development guidelines based on cost-benefit analysis and practical experience. All detailed rules are in `.cursor/rules/` - this document provides a unified overview for AI assistants.

---

## Core Philosophy

**Pragmatic Quality**: Follow principles and guidelines based on Return on Investment (ROI). Rules are guidelines, not absolutes. Always prioritize:
1. **Clarity** over cleverness
2. **Simplicity** over complexity
3. **Readability** over strict rule adherence
4. **Working software** over perfect architecture

---

## Foundational Principles

### KISS (Keep It Simple, Stupid)
- Prefer clarity over cleverness
- Write code that's easy to understand
- Remove unnecessary complexity

### DRY (Don't Repeat Yourself)
- Remove code duplication
- Each piece of knowledge should have a single representation
- Extract common behavior into shared methods/classes

### YAGNI (You Aren't Gonna Need It)
- Implement only what's needed now
- Delete speculative code and dead code immediately
- Don't build for hypothetical future requirements

### Tell, Don't Ask
- Objects should manage their own state
- Don't ask for data and act on it - tell objects what to do
- Move behavior to the class that owns the data

### SOLID Principles
- **SRP**: Single Responsibility Principle - one class, one reason to change
- **OCP**: Open Closed Principle - open for extension, closed for modification
- **LSP**: Liskov Substitution Principle - subtypes must be substitutable
- **DI**: Dependency Inversion Principle - depend on abstractions
- **IS**: Interface Segregation Principle - many specific interfaces over one general

---

## Testing Strategy

### Golden Rule
**NEVER change production code that is not covered by tests**

### For Existing Code (Legacy/Refactoring)
1. **Characterization Tests** - Capture current behavior before changes
2. **Golden Master Tests** - Complete system behavior validation
3. **Model Based Tests** - Business logic and domain model testing
4. **Property Based Tests** - Edge cases and invariants

### For New Features
1. **TDD When Beneficial** - Use Transformation Priority Premises
   - Fake Implementation → Obvious Implementation → Triangulation
2. **Unit Tests** - Test class behavior, not implementation details
3. **Integration Tests** - Test component interactions

### Test Quality
- Descriptive test names that explain the scenario
- One behavior per test
- Simple, readable test code
- Fast and deterministic tests

*Full details: `.cursor/rules/testing.mdc`*

---

## Code Quality: ROI-Based Priorities

The codebase uses a 5-star priority system for code quality issues. Fix based on ROI:

### ⭐⭐⭐⭐⭐ Critical (Fix Immediately)
- **Primitive Obsession** - Wrap domain concepts in classes (Cell, Position, etc.)
- **Duplicated Code** - Extract to shared methods/classes
- **First-Class Collections** - Wrap collections with domain behavior (Grid class)
- **Large Class/God Class** - Split classes with multiple responsibilities (< 50 lines)
- **Long Method** - Extract focused methods (< 15 lines)

### ⭐⭐⭐⭐ High Priority (Address Soon)
- **Long Parameter List** - Aim for 0-2 parameters, max 3
- **Feature Envy** - Move behavior to the data's class
- **Data Clumps** - Group related data into objects
- **Dead Code** - Delete immediately
- **Clear Naming** - No abbreviations, express intent

### ⭐⭐⭐ Medium Priority (Apply When Beneficial)
- **Message Chains** - Encapsulate: `dog.ExpressHappiness()` not `dog.Body.Tail.Wag()`
- **No Public Getters/Setters** - Prefer behavior methods over accessors
- **Switch Statements** - Consider polymorphism when scattered
- **Shotgun Surgery** - Consolidate related functionality
- **Data Class** - Add behavior or eliminate the class

### ⭐⭐ Low Priority (Address Opportunistically)
- **Deep Nesting** - Return early, extract methods
- **Else Keyword** - Use guard clauses when clearer
- **Useless Comments** - Self-documenting code over "what" comments
- **Middle Man** - Cut out or add real behavior
- **Inappropriate Intimacy** - Reduce coupling through interfaces

### ⭐ Questionable (Avoid Strict Enforcement)
- **Two Instance Variables** - Warning sign only, not strict rule
- **Five Lines Per Method** - Use 15 lines as practical limit
- **Alternative Classes** - Only unify if truly same concept
- **Refused Bequest** - Evaluate case by case

*Full details with detection/fixing strategies: `.cursor/rules/code-quality-guide.mdc`*

---

## Refactoring Workflow

### When to Refactor
1. **Before Adding Features** - Clean up the area first
2. **During Code Review** - Note smells, fix critical issues
3. **Opportunistic** - Leave code better than you found it

### How to Refactor
1. **Identify Code Smells** - Use ROI priorities (⭐⭐⭐⭐⭐ → ⭐)
2. **Add Test Coverage** - Characterization tests if needed
3. **Make Incremental Changes** - Small steps, test after each
4. **Verify Improvements** - Ensure maintainability improved

### Design Principles
- **Maximize Cohesion** - Keep related responsibilities together
- **Minimize Coupling** - Reduce class interdependence
- **Maintain Balance** - Don't over-decompose into "ravioli code"

### Anti-Patterns to Avoid
- **Over-Engineering** - Don't sacrifice readability for rules
- **Rule Worship** - Use judgment, not blind adherence
- **Premature Optimization** - Clarity first, performance later
- **Ravioli Code** - Too many tiny classes hurt understanding

*Full details: `.cursor/rules/refactoring.mdc`*

---

## Quality Gates

Before committing code:
- ✓ All tests pass
- ✓ No linting errors
- ✓ Critical issues (⭐⭐⭐⭐⭐) addressed
- ✓ Public interfaces documented

---

## Quick Reference: Common Actions

### Immediate Actions (⭐⭐⭐⭐⭐)
```
→ Delete dead code immediately
→ Wrap primitives in domain classes
→ Extract duplicated code
→ Rename unclear names to express intent
→ Split classes > 50 lines
→ Split methods > 15 lines
```

### Regular Actions (⭐⭐⭐⭐)
```
→ Reduce parameter lists (aim for 0-2)
→ Move behavior to data's class
→ Format code consistently
→ Extract and centralize constants
```

### Opportunistic Actions (⭐⭐⭐)
```
→ Return early to reduce nesting
→ Extract methods from deep conditionals
→ Encapsulate where missing
→ Delete "what" comments, keep "why" comments
```

### Avoid
```
✗ Clever implementations
✗ Premature optimization
✗ Following rules blindly
✗ Over-abstraction
```

---

## Document Structure

- **`.cursor/rules/README.mdc`** - Overview and how to use the rules
- **`.cursor/rules/core-principles.mdc`** - Foundational principles and processes
- **`.cursor/rules/code-quality-guide.mdc`** - **Authoritative source for WHAT to fix** (298 lines of detailed strategies)
- **`.cursor/rules/testing.mdc`** - Testing strategies and TDD guidance
- **`.cursor/rules/refactoring.mdc`** - **Guide for WHEN and HOW to refactor**

---

## For AI Assistants (Claude Code, Cursor, etc.)

When working with this codebase:

1. **Always reference** `.cursor/rules/` for detailed guidance
2. **Prioritize by ROI** - Fix ⭐⭐⭐⭐⭐ issues first
3. **Never refactor without tests** - Add characterization tests first if needed
4. **Use judgment** - These are guidelines, not laws
5. **Focus on readability** - Clear code > perfect adherence to rules
6. **Be incremental** - Small changes with tests after each step

The cursor rules are the **source of truth**. This document is a unified reference.
