#!/usr/bin/env python3
"""
Conway's Game of Life - CLI Implementation

A terminal-based implementation of Conway's Game of Life with animated display.
The game runs on a 30x30 grid with random initial seed and continues until
interrupted by the user (Ctrl+C).
"""

import os
import time
import random
from typing import List

from config.game_config import GameConfig
from domain.grid import Grid
from domain.grid_size import GridSize
from domain.position import Position
from domain.cell import Cell
from domain.generation import Generation
from engine.game_engine import GameEngine
from rules.game_rules import GameRules
from display.console_display import ConsoleDisplay


class GridAccessor:
    """Backward compatibility wrapper to allow array-style grid access."""
    
    def __init__(self, game: 'GameOfLife'):
        self._game = game
    
    def __getitem__(self, row: int) -> 'RowAccessor':
        return RowAccessor(self._game, row)
    
    def __len__(self) -> int:
        """Return number of rows."""
        return self._game.config.grid_size
    
    def __iter__(self):
        """Iterate over rows."""
        for row in range(self._game.config.grid_size):
            yield RowAccessor(self._game, row)
    
    def __eq__(self, other) -> bool:
        """Support comparison for tests."""
        if isinstance(other, GridAccessor):
            return self._to_list() == other._to_list()
        elif isinstance(other, list):
            return self._to_list() == other
        return False
    
    def _to_list(self) -> List[List[bool]]:
        """Convert to 2D boolean list."""
        result = []
        for row in range(self._game.config.grid_size):
            row_list = []
            for col in range(self._game.config.grid_size):
                position = Position(row, col)
                cell = self._game._grid.get_cell(position)
                row_list.append(cell.is_alive())
            result.append(row_list)
        return result


class RowAccessor:
    """Allows row[col] = value syntax."""
    
    def __init__(self, game: 'GameOfLife', row: int):
        self._game = game
        self._row = row
    
    def __getitem__(self, col):
        """Get cell value or slice of cells."""
        if isinstance(col, slice):
            # Handle row[:] or row[start:end] syntax
            result = []
            start, stop, step = col.indices(self._game.config.grid_size)
            for c in range(start, stop, step or 1):
                position = Position(self._row, c)
                cell = self._game._grid.get_cell(position)
                result.append(cell.is_alive())
            return result
        else:
            position = Position(self._row, col)
            cell = self._game._grid.get_cell(position)
            return cell.is_alive()
    
    def __setitem__(self, col: int, value: bool) -> None:
        position = Position(self._row, col)
        cell = Cell.alive_cell() if value else Cell.dead_cell()
        self._game._grid.set_cell(position, cell)
    
    def __len__(self) -> int:
        """Return number of columns."""
        return self._game.config.grid_size
    
    def __iter__(self):
        """Iterate over cells in this row."""
        for col in range(self._game.config.grid_size):
            yield self[col]


class GameOfLife:
    """
    Implementation of Conway's Game of Life.
    
    The Game of Life is a cellular automaton devised by mathematician John Conway.
    It consists of a grid of cells which evolve through discrete time steps based
    on a set of rules.
    """
    
    # Maintain class constants for backward compatibility
    GRID_SIZE = 30
    ALIVE_CHAR = '█'
    DEAD_CHAR = ' '
    DELAY = 0.15
    
    def __init__(self, random_density: float = 0.3, config: GameConfig = None):
        """
        Initialize the Game of Life.
        
        Args:
            random_density: Probability that a cell will be alive initially (0.0 to 1.0)
            config: Optional GameConfig instance (uses defaults if not provided)
        """
        self.config = config or GameConfig(
            grid_size=self.GRID_SIZE,
            alive_char=self.ALIVE_CHAR,
            dead_char=self.DEAD_CHAR,
            delay=self.DELAY,
            initial_density=random_density
        )
        self.random_density = random_density
        
        # Initialize domain objects
        grid_size = GridSize(self.config.grid_size, self.config.grid_size)
        self._grid = Grid(grid_size)
        self._generation = Generation(0)
        
        self._initialize_grid()
    
    @property
    def grid(self) -> GridAccessor:
        """Backward compatibility: return grid accessor for array-style access."""
        return GridAccessor(self)
    
    @grid.setter
    def grid(self, value: List[List[bool]]) -> None:
        """Backward compatibility: set grid from 2D boolean array."""
        for row in range(self.config.grid_size):
            for col in range(self.config.grid_size):
                position = Position(row, col)
                cell = Cell.alive_cell() if value[row][col] else Cell.dead_cell()
                self._grid.set_cell(position, cell)
    
    @property
    def generation(self) -> int:
        """Backward compatibility: return generation as int."""
        return self._generation.number
    
    @generation.setter
    def generation(self, value: int) -> None:
        """Backward compatibility: set generation from int."""
        self._generation = Generation(value)
    
    def _initialize_grid(self) -> None:
        """Initialize the grid with a random pattern."""
        grid_size = self._grid.size()
        for position in grid_size.all_positions():
            if random.random() < self.random_density:
                self._grid.set_cell(position, Cell.alive_cell())
    
    def _count_neighbors(self, row: int, col: int) -> int:
        """
        Count the number of live neighbors for a given cell.
        
        Args:
            row: Row index of the cell
            col: Column index of the cell
            
        Returns:
            Number of live neighbors (0-8)
        """
        position = Position(row, col)
        return self._grid.count_living_neighbors(position)
    
    def _calculate_next_generation(self) -> List[List[bool]]:
        """
        Calculate the next generation based on Conway's Game of Life rules.
        
        Now delegates to GameRules for rule logic.
        
        Returns:
            New grid representing the next generation
        """
        grid_size = self._grid.size()
        new_grid = Grid(grid_size)
        rules = GameRules()
        
        for position in grid_size.all_positions():
            current_cell = self._grid.get_cell(position)
            neighbor_count = self._grid.count_living_neighbors(position)
            next_cell = rules.calculate_next_state(current_cell, neighbor_count)
            
            if next_cell.is_alive():
                new_grid.set_cell(position, next_cell)
        
        # Return as 2D boolean array for backward compatibility
        result = []
        for row in range(self.config.grid_size):
            row_list = []
            for col in range(self.config.grid_size):
                pos = Position(row, col)
                row_list.append(new_grid.get_cell(pos).is_alive())
            result.append(row_list)
        return result
    
    def _clear_screen(self) -> None:
        """Clear the terminal screen (deprecated - use ConsoleDisplay)."""
        display = ConsoleDisplay(self.config)
        display.clear_screen()
    
    def _display(self) -> None:
        """Display the current state of the grid (deprecated - use ConsoleDisplay)."""
        display = ConsoleDisplay(self.config)
        display.render(self._grid, self._generation)
    
    def step(self) -> None:
        """Advance the game by one generation."""
        self.grid = self._calculate_next_generation()
        self._generation = self._generation.next()
    
    def run(self) -> None:
        """Run the game loop until interrupted by the user."""
        # Use GameEngine for cleaner orchestration
        engine = GameEngine(self._grid, self.config)
        engine.generation = self._generation
        engine.run()
        # Update our state to match engine's final state
        self._grid = engine.grid
        self._generation = engine.generation


def main():
    """Main entry point for the Game of Life application."""
    print("Initializing Conway's Game of Life...")
    print("Starting with a random pattern on a 30x30 grid...")
    time.sleep(1)
    
    game = GameOfLife(random_density=0.3)
    game.run()


if __name__ == "__main__":
    main()
