# Game of Life - Refactoring Execution Plan

**Based on:** ANALYSIS.md  
**Plan Date:** 2025-10-14  
**Estimated Total Effort:** 24-34 hours  
**Risk Level:** LOW  

---

## Overview

This document provides the step-by-step execution plan for refactoring the Game of Life codebase according to the Cursor development rules. The plan is designed to be incremental, with each phase delivering independent value while maintaining all existing functionality.

---

## Execution Philosophy

### Core Principles
1. **Safety First:** Never refactor untested code
2. **Incremental Changes:** One concern at a time
3. **Always Green:** Keep tests passing after every change
4. **Pragmatic Application:** Apply rules that add value, not blindly
5. **Measure Impact:** Verify improvements at each phase

### Success Criteria
- ✅ All existing functionality preserved
- ✅ Test coverage ≥ 90%
- ✅ All methods < 15 lines
- ✅ All classes < 50 lines
- ✅ SOLID principles followed
- ✅ High-value Object Calisthenics rules applied
- ✅ Code maintainability improved

---

## Phase 1: Establish Test Safety Net 🚨

**Priority:** CRITICAL  
**Effort:** 6-8 hours  
**ROI:** ⭐⭐⭐⭐⭐  
**Status:** 🔴 NOT STARTED

### Why This Phase?
Without tests, refactoring is dangerous. This phase creates a comprehensive safety net that enables confident code changes. **This phase is non-negotiable.**

### Tasks

#### 1.1 Setup Test Infrastructure (30 min)
```bash
# Create test directory structure
mkdir -p tests
touch tests/__init__.py
touch tests/conftest.py

# Install testing dependencies
pip install pytest pytest-cov hypothesis
```

**Deliverable:** Test infrastructure ready

---

#### 1.2 Characterization Tests (3-4 hours)

Create `tests/test_characterization.py` to capture current behavior:

**Test Categories:**

1. **Grid Initialization Tests**
   ```python
   def test_grid_initialized_with_correct_size()
   def test_grid_respects_random_density()
   def test_all_cells_are_boolean_values()
   def test_generation_starts_at_zero()
   ```

2. **Neighbor Counting Tests**
   ```python
   def test_corner_cell_has_three_neighbors()
   def test_edge_cell_has_five_neighbors()
   def test_center_cell_has_eight_neighbors()
   def test_count_all_alive_neighbors()
   def test_count_all_dead_neighbors()
   def test_count_mixed_neighbors()
   ```

3. **Generation Calculation Tests (Conway's Rules)**
   ```python
   def test_live_cell_dies_with_fewer_than_two_neighbors()
   def test_live_cell_survives_with_two_neighbors()
   def test_live_cell_survives_with_three_neighbors()
   def test_live_cell_dies_with_more_than_three_neighbors()
   def test_dead_cell_becomes_alive_with_three_neighbors()
   def test_dead_cell_stays_dead_otherwise()
   ```

4. **Game Flow Tests**
   ```python
   def test_step_advances_generation_counter()
   def test_step_changes_grid_state()
   def test_grid_state_deterministic_for_same_seed()
   ```

**Verification:**
```bash
pytest tests/test_characterization.py -v
# All tests should pass
```

**Deliverable:** Comprehensive characterization tests covering all current behavior

---

#### 1.3 Golden Master Tests (2-3 hours)

Create `tests/test_golden_master.py` for regression testing:

**Test Patterns:**

1. **Blinker (Period-2 Oscillator)**
   ```python
   def test_blinker_oscillates_correctly():
       # Initial: vertical line of 3 cells
       # Gen 1: horizontal line of 3 cells
       # Gen 2: vertical line (back to start)
   ```

2. **Glider (Moving Pattern)**
   ```python
   def test_glider_moves_diagonally():
       # Glider should move down-right over 4 generations
   ```

3. **Block (Still Life)**
   ```python
   def test_block_remains_stable():
       # 2x2 block should never change
   ```

4. **Beehive (Still Life)**
   ```python
   def test_beehive_remains_stable():
       # Beehive pattern should never change
   ```

5. **Reproducibility**
   ```python
   def test_same_seed_produces_same_sequence():
       # Two games with same seed should be identical
   ```

**Verification:**
```bash
pytest tests/test_golden_master.py -v
# All known patterns should work correctly
```

**Deliverable:** Golden master tests for known Game of Life patterns

---

#### 1.4 Model-Based Tests (1-2 hours)

Create `tests/test_game_rules.py` for rule verification:

```python
@pytest.mark.parametrize("neighbor_count,expected_alive", [
    (0, False),  # Under-population
    (1, False),  # Under-population
    (2, True),   # Survival
    (3, True),   # Survival
    (4, False),  # Over-population
    (5, False),  # Over-population
    (6, False),  # Over-population
    (7, False),  # Over-population
    (8, False),  # Over-population
])
def test_live_cell_next_state(neighbor_count, expected_alive):
    # Test each rule independently

@pytest.mark.parametrize("neighbor_count,expected_alive", [
    (0, False),
    (1, False),
    (2, False),
    (3, True),   # Reproduction
    (4, False),
    (5, False),
    (6, False),
    (7, False),
    (8, False),
])
def test_dead_cell_next_state(neighbor_count, expected_alive):
    # Test reproduction rule
```

**Verification:**
```bash
pytest tests/test_game_rules.py -v
# All Conway's rules should pass
```

**Deliverable:** Model-based tests verifying game rules

---

#### 1.5 Property-Based Tests (Optional - 2 hours)

Create `tests/test_properties.py` using Hypothesis:

```python
from hypothesis import given, strategies as st

@given(st.integers(min_value=0, max_value=100))
def test_grid_size_remains_constant(steps):
    # Grid dimensions never change

@given(st.floats(min_value=0.0, max_value=1.0))
def test_density_within_expected_range(density):
    # Initial density approximately matches requested

def test_empty_grid_stays_empty():
    # No spontaneous generation

def test_full_grid_dies_immediately():
    # All cells die from overcrowding
```

**Verification:**
```bash
pytest tests/test_properties.py -v
# All properties should hold
```

**Deliverable:** Property-based tests for invariants

---

### Phase 1 Completion Checklist

- [ ] Test infrastructure set up
- [ ] All characterization tests passing
- [ ] Golden master tests passing
- [ ] Model-based tests passing
- [ ] Property-based tests passing (optional)
- [ ] Test coverage report generated
- [ ] Coverage ≥ 80% of current code

**Gate:** Cannot proceed to Phase 2 until all tests are green ✅

---

## Phase 2: High-ROI Refactoring 🎯

**Priority:** HIGH  
**Effort:** 8-12 hours  
**ROI:** ⭐⭐⭐⭐⭐  
**Status:** 🟡 BLOCKED (waiting for Phase 1)

### Why This Phase?
These changes provide maximum value with reasonable effort. They establish the foundation for all subsequent refactoring.

---

### Task 2.1: Extract Magic Numbers (30 min)

**Goal:** Centralize all configuration

**Steps:**

1. Create `config/game_config.py`:
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class GameConfig:
    """Configuration for Game of Life."""
    grid_size: int = 30
    alive_char: str = '█'
    dead_char: str = ' '
    delay: float = 0.15
    initial_density: float = 0.3
    clear_command: str = 'clear'
    
    def __post_init__(self):
        if not 0.0 <= self.initial_density <= 1.0:
            raise ValueError("Density must be between 0 and 1")
        if self.grid_size < 1:
            raise ValueError("Grid size must be positive")
```

2. Update `GameOfLife.__init__()`:
```python
def __init__(self, config: GameConfig = None):
    self.config = config or GameConfig()
    self.grid: List[List[bool]] = []
    self.generation: int = 0
    self._initialize_grid()
```

3. Replace all hardcoded values with `self.config.*`

4. Add tests for `GameConfig`:
```python
# tests/test_config.py
def test_game_config_validates_density()
def test_game_config_validates_grid_size()
def test_game_config_immutable()
```

**Verification:**
```bash
pytest tests/ -v
# All existing tests still pass
# New config tests pass
```

**Deliverable:** Centralized configuration with validation

---

### Task 2.2: Create Domain Objects (3-4 hours)

**Goal:** Eliminate primitive obsession

**Steps:**

1. **Create `domain/cell.py`:**
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Cell:
    """Represents a single cell in the Game of Life."""
    alive: bool
    
    @classmethod
    def alive_cell(cls) -> 'Cell':
        return cls(alive=True)
    
    @classmethod
    def dead_cell(cls) -> 'Cell':
        return cls(alive=False)
    
    def is_alive(self) -> bool:
        return self.alive
    
    def is_dead(self) -> bool:
        return not self.alive
```

2. **Create `domain/position.py`:**
```python
from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class Position:
    """Represents a position in the grid."""
    row: int
    col: int
    
    def neighbors(self) -> List['Position']:
        """Return all 8 neighboring positions."""
        return [
            Position(self.row + dr, self.col + dc)
            for dr in [-1, 0, 1]
            for dc in [-1, 0, 1]
            if not (dr == 0 and dc == 0)
        ]
    
    def __str__(self) -> str:
        return f"({self.row}, {self.col})"
```

3. **Create `domain/grid_size.py`:**
```python
from dataclasses import dataclass
from domain.position import Position

@dataclass(frozen=True)
class GridSize:
    """Represents the dimensions of the grid."""
    width: int
    height: int
    
    def contains(self, position: Position) -> bool:
        """Check if position is within grid bounds."""
        return (0 <= position.row < self.height and
                0 <= position.col < self.width)
    
    def all_positions(self) -> List[Position]:
        """Return all positions in the grid."""
        return [Position(row, col)
                for row in range(self.height)
                for col in range(self.width)]
```

4. **Create `domain/generation.py`:**
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Generation:
    """Represents a generation number."""
    number: int
    
    def next(self) -> 'Generation':
        return Generation(self.number + 1)
    
    def __str__(self) -> str:
        return str(self.number)
```

5. **Add comprehensive tests:**
```python
# tests/domain/test_cell.py
# tests/domain/test_position.py
# tests/domain/test_grid_size.py
# tests/domain/test_generation.py
```

**Verification:**
```bash
pytest tests/domain/ -v
# All domain object tests pass
```

**Deliverable:** Domain objects with tests

---

### Task 2.3: Implement First-Class Grid Collection (2-3 hours)

**Goal:** Encapsulate grid operations

**Steps:**

1. **Create `domain/grid.py`:**
```python
from typing import Dict, Set
from domain.cell import Cell
from domain.position import Position
from domain.grid_size import GridSize

class Grid:
    """First-class collection representing the game grid."""
    
    def __init__(self, size: GridSize):
        self._size = size
        self._cells: Dict[Position, Cell] = {}
        self._initialize_empty()
    
    def _initialize_empty(self) -> None:
        """Initialize all cells as dead."""
        for position in self._size.all_positions():
            self._cells[position] = Cell.dead_cell()
    
    def set_cell(self, position: Position, cell: Cell) -> None:
        """Set the state of a cell at position."""
        if not self._size.contains(position):
            raise ValueError(f"Position {position} out of bounds")
        self._cells[position] = cell
    
    def get_cell(self, position: Position) -> Cell:
        """Get the cell at position."""
        if not self._size.contains(position):
            return Cell.dead_cell()  # Out of bounds = dead
        return self._cells.get(position, Cell.dead_cell())
    
    def count_living_neighbors(self, position: Position) -> int:
        """Count living neighbors for a position."""
        return sum(1 for neighbor in position.neighbors()
                   if self._size.contains(neighbor)
                   and self.get_cell(neighbor).is_alive())
    
    def living_cells(self) -> Set[Position]:
        """Return all positions with living cells."""
        return {pos for pos, cell in self._cells.items()
                if cell.is_alive()}
    
    def size(self) -> GridSize:
        """Return the grid size."""
        return self._size
```

2. **Add Grid tests:**
```python
# tests/domain/test_grid.py
def test_grid_initialization()
def test_set_and_get_cell()
def test_count_living_neighbors_corner()
def test_count_living_neighbors_edge()
def test_count_living_neighbors_center()
def test_living_cells_returns_correct_set()
def test_out_of_bounds_position_returns_dead_cell()
```

**Verification:**
```bash
pytest tests/domain/test_grid.py -v
# All grid tests pass
```

**Deliverable:** First-class Grid collection with tests

---

### Task 2.4: Update GameOfLife to Use Domain Objects (2-3 hours)

**Goal:** Integrate domain objects into existing code

**Steps:**

1. Update `GameOfLife` class to use domain objects:
   - Replace `List[List[bool]]` with `Grid`
   - Replace `int` with `Generation`
   - Use `Position` instead of row/col tuples
   - Use `Cell` instead of bool

2. Update `_count_neighbors()` to use `Position`:
```python
def _count_neighbors(self, position: Position) -> int:
    return self.grid.count_living_neighbors(position)
```

3. Update `_calculate_next_generation()` to use domain objects

4. Run all tests to ensure no regression

**Verification:**
```bash
pytest tests/ -v
# All tests still pass (behavior unchanged)
```

**Deliverable:** GameOfLife using domain objects

---

### Phase 2 Completion Checklist

- [ ] Configuration extracted and tested
- [ ] All domain objects created and tested
- [ ] First-class Grid collection implemented
- [ ] GameOfLife updated to use domain objects
- [ ] All tests passing (no regression)
- [ ] Code review completed

**Gate:** All tests must be green ✅

---

## Phase 3: Single Responsibility Principle 🏗️

**Priority:** HIGH  
**Effort:** 6-8 hours  
**ROI:** ⭐⭐⭐⭐⭐  
**Status:** 🟡 BLOCKED (waiting for Phase 2)

### Why This Phase?
Separating concerns makes the code easier to test, maintain, and extend. Each class will have a single, well-defined purpose.

---

### Task 3.1: Extract GameRules Class (1-2 hours)

**Goal:** Isolate Conway's rules logic

**Create `rules/game_rules.py`:**
```python
from domain.cell import Cell

class GameRules:
    """Conway's Game of Life rules."""
    
    @staticmethod
    def calculate_next_state(current_cell: Cell, living_neighbors: int) -> Cell:
        """
        Calculate the next state based on Conway's rules.
        
        Rules:
        - Live cell with 2-3 neighbors: survives
        - Live cell with <2 or >3 neighbors: dies
        - Dead cell with exactly 3 neighbors: becomes alive
        """
        if current_cell.is_alive():
            if living_neighbors in [2, 3]:
                return Cell.alive_cell()
            return Cell.dead_cell()
        else:
            if living_neighbors == 3:
                return Cell.alive_cell()
            return Cell.dead_cell()
```

**Add tests:**
```python
# tests/rules/test_game_rules.py
@pytest.mark.parametrize("alive,neighbors,expected_alive", [
    (True, 0, False),
    (True, 1, False),
    (True, 2, True),
    (True, 3, True),
    (True, 4, False),
    (False, 2, False),
    (False, 3, True),
])
def test_game_rules(alive, neighbors, expected_alive):
    # Test all rules
```

**Verification:**
```bash
pytest tests/rules/ -v
```

**Deliverable:** Isolated GameRules class

---

### Task 3.2: Extract ConsoleDisplay Class (2-3 hours)

**Goal:** Separate presentation logic

**Create `display/console_display.py`:**
```python
import os
from domain.grid import Grid
from domain.generation import Generation
from config.game_config import GameConfig

class ConsoleDisplay:
    """Handles console rendering of the game."""
    
    def __init__(self, config: GameConfig):
        self.config = config
    
    def clear_screen(self) -> None:
        """Clear the terminal screen."""
        os.system(self.config.clear_command)
    
    def render(self, grid: Grid, generation: Generation) -> None:
        """Render the grid and generation to console."""
        self.clear_screen()
        self._render_header(generation)
        self._render_grid(grid)
        self._render_footer()
    
    def _render_header(self, generation: Generation) -> None:
        """Render the header."""
        width = self.config.grid_size * 2
        print("╔" + "═" * width + "╗")
        print(f"║  Conway's Game of Life - Generation {generation:>8}  ║")
        print("╠" + "═" * width + "╣")
    
    def _render_grid(self, grid: Grid) -> None:
        """Render the grid cells."""
        for position in grid.size().all_positions():
            if position.col == 0:
                print("║", end="")
            
            cell = grid.get_cell(position)
            char = self.config.alive_char if cell.is_alive() else self.config.dead_char
            print(char * 2, end="")
            
            if position.col == grid.size().width - 1:
                print("║")
    
    def _render_footer(self) -> None:
        """Render the footer."""
        width = self.config.grid_size * 2
        print("╚" + "═" * width + "╝")
        print("\nPress Ctrl+C to stop")
```

**Deliverable:** Separated display logic

---

### Task 3.3: Extract GameEngine Class (2-3 hours)

**Goal:** Orchestrate game flow

**Create `engine/game_engine.py`:**
```python
import time
from domain.grid import Grid
from domain.generation import Generation
from rules.game_rules import GameRules
from display.console_display import ConsoleDisplay
from config.game_config import GameConfig

class GameEngine:
    """Orchestrates the Game of Life."""
    
    def __init__(self, grid: Grid, config: GameConfig):
        self.grid = grid
        self.generation = Generation(0)
        self.config = config
        self.rules = GameRules()
        self.display = ConsoleDisplay(config)
    
    def step(self) -> None:
        """Advance the game by one generation."""
        self.grid = self._calculate_next_generation()
        self.generation = self.generation.next()
    
    def run(self) -> None:
        """Run the game loop."""
        try:
            while True:
                self.display.render(self.grid, self.generation)
                time.sleep(self.config.delay)
                self.step()
        except KeyboardInterrupt:
            self._handle_exit()
    
    def _calculate_next_generation(self) -> Grid:
        """Calculate the next generation."""
        new_grid = Grid(self.grid.size())
        
        for position in self.grid.size().all_positions():
            current_cell = self.grid.get_cell(position)
            neighbor_count = self.grid.count_living_neighbors(position)
            next_cell = self.rules.calculate_next_state(current_cell, neighbor_count)
            new_grid.set_cell(position, next_cell)
        
        return new_grid
    
    def _handle_exit(self) -> None:
        """Handle graceful exit."""
        print(f"\n\nGame stopped at generation {self.generation}")
        print("Thanks for playing!")
```

**Deliverable:** GameEngine orchestrating components

---

### Task 3.4: Update main.py (1 hour)

**Goal:** Compose objects in main entry point

**Update `game_of_life.py` or create new `main.py`:**
```python
#!/usr/bin/env python3
import random
from config.game_config import GameConfig
from domain.grid import Grid
from domain.grid_size import GridSize
from domain.position import Position
from domain.cell import Cell
from engine.game_engine import GameEngine

def create_random_grid(config: GameConfig) -> Grid:
    """Create a grid with random initial state."""
    size = GridSize(config.grid_size, config.grid_size)
    grid = Grid(size)
    
    for position in size.all_positions():
        if random.random() < config.initial_density:
            grid.set_cell(position, Cell.alive_cell())
    
    return grid

def main():
    """Main entry point."""
    print("Initializing Conway's Game of Life...")
    
    config = GameConfig()
    grid = create_random_grid(config)
    engine = GameEngine(grid, config)
    
    engine.run()

if __name__ == "__main__":
    main()
```

**Deliverable:** Clean main entry point

---

### Phase 3 Completion Checklist

- [ ] GameRules extracted and tested
- [ ] ConsoleDisplay extracted and tested
- [ ] GameEngine created and tested
- [ ] main.py updated
- [ ] All tests passing
- [ ] Game runs correctly (visual verification)
- [ ] Each class < 50 lines
- [ ] Each method < 15 lines

**Gate:** All tests green, game works correctly ✅

---

## Phase 4: Polish and Cleanup 🎨

**Priority:** MEDIUM  
**Effort:** 4-6 hours  
**ROI:** ⭐⭐⭐⭐  
**Status:** 🟡 BLOCKED (waiting for Phase 3)

### Task 4.1: Apply Tell-Don't-Ask (1-2 hours)

1. Review all getter usage
2. Move behavior to appropriate classes
3. Add `Grid.evolve()` method
4. Ensure cells are told what to do, not queried

---

### Task 4.2: Reduce Method Complexity (1 hour)

1. Extract complex conditions to named methods
2. Use early returns to reduce nesting
3. Ensure all methods < 15 lines

---

### Task 4.3: Remove Unnecessary Comments (30 min)

1. Delete "what" comments
2. Keep only "why" comments
3. Improve names instead of commenting

---

### Task 4.4: Add Property-Based Tests (2 hours)

1. Use Hypothesis for invariant testing
2. Test grid size stability
3. Test generation monotonicity
4. Test known patterns

---

### Phase 4 Completion Checklist

- [ ] Tell-Don't-Ask applied
- [ ] All methods < 15 lines
- [ ] Unnecessary comments removed
- [ ] Property-based tests added
- [ ] Test coverage > 90%
- [ ] Flake8 passes
- [ ] All tests green

---

## Final Deliverables

At the end of all phases:

1. **Codebase:**
   - Clean, maintainable architecture
   - SOLID principles followed
   - Object Calisthenics pragmatically applied
   - All code < 50 lines per class, < 15 lines per method

2. **Tests:**
   - Comprehensive test suite
   - > 90% coverage
   - Characterization, unit, integration, and property-based tests
   - All tests green

3. **Documentation:**
   - Architecture documentation
   - Class diagrams
   - Design decisions documented
   - This refactoring plan updated with actual results

---

## Risk Mitigation

### If Tests Break
1. Stop immediately
2. Revert last change
3. Review what went wrong
4. Make smaller incremental change

### If Complexity Increases
1. Stop and reassess
2. Don't blindly follow rules
3. Consider if change adds value
4. Potentially revert if negative impact

### If Timeline Overruns
1. Each phase delivers value independently
2. Can stop after any phase
3. Document what was completed
4. Plan future phases as needed

---

## Success Metrics

### Before Refactoring
- Lines of code: ~170
- Classes: 1
- Test coverage: 0%
- Responsibilities per class: 6
- Longest method: 30 lines

### After Refactoring (Target)
- Lines of code: ~400-500 (more, but cleaner)
- Classes: ~10 (focused responsibilities)
- Test coverage: > 90%
- Responsibilities per class: 1
- Longest method: < 15 lines
- Maintainability: High
- Extensibility: High
- Testability: High

---

## Next Steps

1. Review this plan with team
2. Set up development environment
3. Begin Phase 1: Establish Test Safety Net
4. Execute phases incrementally
5. Document lessons learned
6. Celebrate clean code! 🎉

---

**Remember:** The goal is not perfect code, but **maintainable, testable, and understandable** code. Apply rules pragmatically, not dogmatically.
