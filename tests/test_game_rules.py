"""Unit tests for GameRules class."""
import pytest
from domain.cell import Cell
from rules.game_rules import GameRules


class TestGameRules:
    """Test Conway's Game of Life rules implementation."""
    
    @pytest.mark.parametrize("neighbors,expected_alive", [
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
    def test_live_cell_rules(self, neighbors, expected_alive):
        """Test rules for living cells."""
        live_cell = Cell.alive_cell()
        next_state = GameRules.calculate_next_state(live_cell, neighbors)
        assert next_state.is_alive() == expected_alive
    
    @pytest.mark.parametrize("neighbors,expected_alive", [
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
    def test_dead_cell_rules(self, neighbors, expected_alive):
        """Test rules for dead cells."""
        dead_cell = Cell.dead_cell()
        next_state = GameRules.calculate_next_state(dead_cell, neighbors)
        assert next_state.is_alive() == expected_alive
    
    def test_survival_with_two_neighbors(self):
        """Live cell with 2 neighbors survives."""
        cell = Cell.alive_cell()
        result = GameRules.calculate_next_state(cell, 2)
        assert result.is_alive()
    
    def test_survival_with_three_neighbors(self):
        """Live cell with 3 neighbors survives."""
        cell = Cell.alive_cell()
        result = GameRules.calculate_next_state(cell, 3)
        assert result.is_alive()
    
    def test_underpopulation(self):
        """Live cell with < 2 neighbors dies."""
        cell = Cell.alive_cell()
        assert GameRules.calculate_next_state(cell, 0).is_dead()
        assert GameRules.calculate_next_state(cell, 1).is_dead()
    
    def test_overpopulation(self):
        """Live cell with > 3 neighbors dies."""
        cell = Cell.alive_cell()
        assert GameRules.calculate_next_state(cell, 4).is_dead()
        assert GameRules.calculate_next_state(cell, 5).is_dead()
    
    def test_reproduction(self):
        """Dead cell with exactly 3 neighbors becomes alive."""
        cell = Cell.dead_cell()
        result = GameRules.calculate_next_state(cell, 3)
        assert result.is_alive()
    
    def test_dead_stays_dead_without_three_neighbors(self):
        """Dead cell without exactly 3 neighbors stays dead."""
        cell = Cell.dead_cell()
        for neighbors in [0, 1, 2, 4, 5, 6, 7, 8]:
            result = GameRules.calculate_next_state(cell, neighbors)
            assert result.is_dead(), f"Failed with {neighbors} neighbors"
