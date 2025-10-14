"""Unit tests for GameEngine class."""
import pytest
from domain.grid import Grid
from domain.grid_size import GridSize
from domain.position import Position
from domain.cell import Cell
from domain.generation import Generation
from config.game_config import GameConfig
from engine.game_engine import GameEngine


class TestGameEngine:
    """Test GameEngine orchestration."""
    
    def test_engine_initializes_with_grid_and_config(self):
        """GameEngine should initialize with grid and config."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        
        engine = GameEngine(grid, config)
        
        assert engine.grid is not None
        assert engine.config == config
        assert engine.generation.number == 0
    
    def test_step_advances_generation(self):
        """Step should increment generation number."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        engine = GameEngine(grid, config)
        
        initial_gen = engine.generation.number
        engine.step()
        
        assert engine.generation.number == initial_gen + 1
    
    def test_step_calculates_next_generation(self):
        """Step should update grid based on rules."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        
        # Create a blinker pattern
        grid.set_cell(Position(5, 4), Cell.alive_cell())
        grid.set_cell(Position(5, 5), Cell.alive_cell())
        grid.set_cell(Position(5, 6), Cell.alive_cell())
        
        engine = GameEngine(grid, config)
        engine.step()
        
        # After one step, blinker should be vertical
        assert engine.grid.get_cell(Position(4, 5)).is_alive()
        assert engine.grid.get_cell(Position(5, 5)).is_alive()
        assert engine.grid.get_cell(Position(6, 5)).is_alive()
    
    def test_empty_grid_stays_empty(self):
        """Empty grid should remain empty after step."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        engine = GameEngine(grid, config)
        
        engine.step()
        
        # Verify all cells are dead
        for position in size.all_positions():
            assert engine.grid.get_cell(position).is_dead()
    
    def test_block_pattern_stays_stable(self):
        """2x2 block should remain unchanged."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        
        # Create block
        grid.set_cell(Position(5, 5), Cell.alive_cell())
        grid.set_cell(Position(5, 6), Cell.alive_cell())
        grid.set_cell(Position(6, 5), Cell.alive_cell())
        grid.set_cell(Position(6, 6), Cell.alive_cell())
        
        engine = GameEngine(grid, config)
        engine.step()
        
        # Block should be unchanged
        assert engine.grid.get_cell(Position(5, 5)).is_alive()
        assert engine.grid.get_cell(Position(5, 6)).is_alive()
        assert engine.grid.get_cell(Position(6, 5)).is_alive()
        assert engine.grid.get_cell(Position(6, 6)).is_alive()
    
    def test_multiple_steps(self):
        """Multiple steps should advance generation correctly."""
        size = GridSize(10, 10)
        grid = Grid(size)
        config = GameConfig(grid_size=10)
        engine = GameEngine(grid, config)
        
        for i in range(5):
            engine.step()
        
        assert engine.generation.number == 5
