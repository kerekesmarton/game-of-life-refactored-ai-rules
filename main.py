#!/usr/bin/env python3
"""
Conway's Game of Life - Main Entry Point

Clean architecture implementation using separated concerns:
- Domain objects (Cell, Position, Grid, etc.)
- Rules (GameRules)
- Display (ConsoleDisplay)
- Engine (GameEngine)
"""

import random
import time
from config.game_config import GameConfig
from domain.grid import Grid
from domain.grid_size import GridSize
from domain.position import Position
from domain.cell import Cell
from engine.game_engine import GameEngine


def create_random_grid(config: GameConfig) -> Grid:
    """Create a grid with random initial state.
    
    Args:
        config: Game configuration
        
    Returns:
        Grid with randomly populated cells
    """
    size = GridSize(config.grid_size, config.grid_size)
    grid = Grid(size)
    
    for position in size.all_positions():
        if random.random() < config.initial_density:
            grid.set_cell(position, Cell.alive_cell())
    
    return grid


def main():
    """Main entry point for the Game of Life application."""
    print("Initializing Conway's Game of Life...")
    print("Starting with a random pattern on a 30x30 grid...")
    time.sleep(1)
    
    # Create game configuration
    config = GameConfig()
    
    # Create initial random grid
    grid = create_random_grid(config)
    
    # Create and run game engine
    engine = GameEngine(grid, config)
    engine.run()


if __name__ == "__main__":
    main()
