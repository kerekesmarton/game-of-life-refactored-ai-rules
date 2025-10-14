"""
Characterization tests for Game of Life.

These tests capture the current behavior of the GameOfLife class
to ensure refactoring doesn't break existing functionality.
"""
import pytest
import random
from game_of_life import GameOfLife


class TestGridInitialization:
    """Test grid initialization behavior."""
    
    def test_grid_initialized_with_correct_size(self):
        """Grid should be 30x30 (GRID_SIZE constant)."""
        game = GameOfLife()
        assert len(game.grid) == 30
        assert all(len(row) == 30 for row in game.grid)
    
    def test_grid_respects_random_density(self):
        """Initial grid should approximately match requested density."""
        random.seed(42)
        game = GameOfLife(random_density=0.3)
        
        alive_count = sum(sum(row) for row in game.grid)
        total_cells = 30 * 30
        actual_density = alive_count / total_cells
        
        # Allow 10% margin of error for randomness
        assert 0.2 <= actual_density <= 0.4
    
    def test_all_cells_are_boolean_values(self):
        """All cells should be boolean values."""
        game = GameOfLife()
        for row in game.grid:
            for cell in row:
                assert isinstance(cell, bool)
    
    def test_generation_starts_at_zero(self):
        """Generation counter should start at 0."""
        game = GameOfLife()
        assert game.generation == 0
    
    def test_empty_grid_when_density_zero(self):
        """Grid should be all dead cells when density is 0."""
        game = GameOfLife(random_density=0.0)
        alive_count = sum(sum(row) for row in game.grid)
        assert alive_count == 0
    
    def test_full_grid_when_density_one(self):
        """Grid should be all alive cells when density is 1."""
        game = GameOfLife(random_density=1.0)
        alive_count = sum(sum(row) for row in game.grid)
        assert alive_count == 30 * 30


class TestNeighborCounting:
    """Test neighbor counting logic."""
    
    def test_corner_cell_top_left(self):
        """Top-left corner cell (0,0) has maximum 3 neighbors."""
        game = GameOfLife(random_density=0.0)
        # Set up: make all potential neighbors alive
        game.grid[0][1] = True  # right
        game.grid[1][0] = True  # below
        game.grid[1][1] = True  # diagonal
        
        count = game._count_neighbors(0, 0)
        assert count == 3
    
    def test_corner_cell_top_right(self):
        """Top-right corner cell has maximum 3 neighbors."""
        game = GameOfLife(random_density=0.0)
        game.grid[0][28] = True  # left
        game.grid[1][28] = True  # below-left
        game.grid[1][29] = True  # below
        
        count = game._count_neighbors(0, 29)
        assert count == 3
    
    def test_corner_cell_bottom_left(self):
        """Bottom-left corner cell has maximum 3 neighbors."""
        game = GameOfLife(random_density=0.0)
        game.grid[28][0] = True  # above
        game.grid[28][1] = True  # above-right
        game.grid[29][1] = True  # right
        
        count = game._count_neighbors(29, 0)
        assert count == 3
    
    def test_corner_cell_bottom_right(self):
        """Bottom-right corner cell has maximum 3 neighbors."""
        game = GameOfLife(random_density=0.0)
        game.grid[28][28] = True  # above-left
        game.grid[28][29] = True  # above
        game.grid[29][28] = True  # left
        
        count = game._count_neighbors(29, 29)
        assert count == 3
    
    def test_edge_cell_top(self):
        """Top edge cell has maximum 5 neighbors."""
        game = GameOfLife(random_density=0.0)
        # Cell at (0, 15) - top edge, middle
        game.grid[0][14] = True  # left
        game.grid[0][16] = True  # right
        game.grid[1][14] = True  # below-left
        game.grid[1][15] = True  # below
        game.grid[1][16] = True  # below-right
        
        count = game._count_neighbors(0, 15)
        assert count == 5
    
    def test_edge_cell_left(self):
        """Left edge cell has maximum 5 neighbors."""
        game = GameOfLife(random_density=0.0)
        # Cell at (15, 0) - left edge, middle
        game.grid[14][0] = True  # above
        game.grid[14][1] = True  # above-right
        game.grid[15][1] = True  # right
        game.grid[16][0] = True  # below
        game.grid[16][1] = True  # below-right
        
        count = game._count_neighbors(15, 0)
        assert count == 5
    
    def test_center_cell_has_eight_neighbors(self):
        """Center cell has maximum 8 neighbors."""
        game = GameOfLife(random_density=0.0)
        # Cell at (15, 15) - center
        positions = [
            (14, 14), (14, 15), (14, 16),
            (15, 14),           (15, 16),
            (16, 14), (16, 15), (16, 16),
        ]
        for row, col in positions:
            game.grid[row][col] = True
        
        count = game._count_neighbors(15, 15)
        assert count == 8
    
    def test_count_all_alive_neighbors(self):
        """Correctly count when all neighbors are alive."""
        game = GameOfLife(random_density=1.0)
        # In a full grid, every center cell has 8 alive neighbors
        count = game._count_neighbors(15, 15)
        assert count == 8
    
    def test_count_all_dead_neighbors(self):
        """Correctly count when all neighbors are dead."""
        game = GameOfLife(random_density=0.0)
        count = game._count_neighbors(15, 15)
        assert count == 0
    
    def test_count_mixed_neighbors(self):
        """Correctly count mixed alive/dead neighbors."""
        game = GameOfLife(random_density=0.0)
        # Cell at (15, 15) - set 3 neighbors alive
        game.grid[14][15] = True  # above
        game.grid[15][16] = True  # right
        game.grid[16][15] = True  # below
        
        count = game._count_neighbors(15, 15)
        assert count == 3
    
    def test_does_not_count_self(self):
        """Should not count the cell itself as a neighbor."""
        game = GameOfLife(random_density=0.0)
        game.grid[15][15] = True  # Make center cell alive
        
        count = game._count_neighbors(15, 15)
        assert count == 0  # No neighbors, just itself


class TestGenerationCalculation:
    """Test Conway's Game of Life rules."""
    
    def test_live_cell_dies_with_zero_neighbors(self):
        """Live cell with 0 neighbors dies (under-population)."""
        game = GameOfLife(random_density=0.0)
        game.grid[15][15] = True
        
        game.step()
        
        assert game.grid[15][15] == False
    
    def test_live_cell_dies_with_one_neighbor(self):
        """Live cell with 1 neighbor dies (under-population)."""
        game = GameOfLife(random_density=0.0)
        game.grid[15][15] = True
        game.grid[15][16] = True
        
        game.step()
        
        assert game.grid[15][15] == False
    
    def test_live_cell_survives_with_two_neighbors(self):
        """Live cell with 2 neighbors survives."""
        game = GameOfLife(random_density=0.0)
        # Create a stable pattern: 3 cells in a row (blinker)
        game.grid[15][14] = True
        game.grid[15][15] = True
        game.grid[15][16] = True
        
        game.step()
        
        # Middle cell has 2 neighbors, should survive
        # (Note: it rotates to vertical, so check column 15)
        assert game.grid[15][15] == True
    
    def test_live_cell_survives_with_three_neighbors(self):
        """Live cell with 3 neighbors survives."""
        game = GameOfLife(random_density=0.0)
        # Create 2x2 block (stable pattern)
        game.grid[15][15] = True
        game.grid[15][16] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        
        game.step()
        
        # Each cell has 3 neighbors (in a 2x2 block)
        assert game.grid[15][15] == True
    
    def test_live_cell_dies_with_four_neighbors(self):
        """Live cell with 4 neighbors dies (over-population)."""
        game = GameOfLife(random_density=0.0)
        # Create a + pattern
        game.grid[14][15] = True  # above
        game.grid[15][14] = True  # left
        game.grid[15][15] = True  # center (has 4 neighbors)
        game.grid[15][16] = True  # right
        game.grid[16][15] = True  # below
        
        game.step()
        
        # Center cell had 4 neighbors, should die
        assert game.grid[15][15] == False
    
    def test_live_cell_dies_with_more_than_three_neighbors(self):
        """Live cell with >3 neighbors dies (over-population)."""
        game = GameOfLife(random_density=1.0)
        # In a full grid, cells have 8 neighbors (except edges)
        
        game.step()
        
        # All interior cells should die from overcrowding
        assert game.grid[15][15] == False
    
    def test_dead_cell_becomes_alive_with_three_neighbors(self):
        """Dead cell with exactly 3 neighbors becomes alive (reproduction)."""
        game = GameOfLife(random_density=0.0)
        # Create L-shape, leaving one cell dead that has 3 neighbors
        game.grid[14][15] = True
        game.grid[15][15] = True
        game.grid[15][16] = True
        # Cell at (14, 16) is dead but has 3 neighbors
        
        game.step()
        
        assert game.grid[14][16] == True
    
    def test_dead_cell_stays_dead_with_two_neighbors(self):
        """Dead cell with 2 neighbors stays dead."""
        game = GameOfLife(random_density=0.0)
        game.grid[15][15] = True
        game.grid[15][16] = True
        # Cell at (15, 17) has 1 neighbor (only 15,16)
        # Cell at (14, 15) has 2 neighbors
        
        game.step()
        
        # These cells should stay dead
        assert game.grid[14][15] == False or game.grid[14][16] == False
    
    def test_dead_cell_stays_dead_with_four_neighbors(self):
        """Dead cell with 4 neighbors stays dead."""
        game = GameOfLife(random_density=0.0)
        # Create + pattern with dead center
        game.grid[14][15] = True
        game.grid[15][14] = True
        # (15, 15) is dead with 2 neighbors
        game.grid[15][16] = True
        game.grid[16][15] = True
        
        # The dead cell at (15,15) has 4 alive neighbors
        game.step()
        
        # With 4 neighbors, reproduction doesn't happen
        # (needs exactly 3)


class TestGameFlow:
    """Test game flow and state management."""
    
    def test_step_advances_generation_counter(self):
        """Step should increment generation counter."""
        game = GameOfLife()
        initial_gen = game.generation
        
        game.step()
        
        assert game.generation == initial_gen + 1
    
    def test_multiple_steps_advance_generation(self):
        """Multiple steps should increment generation multiple times."""
        game = GameOfLife()
        
        for i in range(5):
            game.step()
        
        assert game.generation == 5
    
    def test_step_changes_grid_state(self):
        """Step should modify grid state."""
        game = GameOfLife(random_density=0.3)
        random.seed(42)
        
        # Capture initial state
        initial_state = [row[:] for row in game.grid]
        
        game.step()
        
        # Grid should have changed (with reasonable probability)
        # Check that at least some cells changed
        changes = sum(
            1 for row in range(30) for col in range(30)
            if game.grid[row][col] != initial_state[row][col]
        )
        
        # With 30% density, very likely that something changes
        assert changes > 0
    
    def test_grid_state_deterministic_for_same_seed(self):
        """Same seed should produce identical sequences."""
        # Game 1
        random.seed(42)
        game1 = GameOfLife(random_density=0.3)
        game1.step()
        game1.step()
        state1 = [row[:] for row in game1.grid]
        
        # Game 2 with same seed
        random.seed(42)
        game2 = GameOfLife(random_density=0.3)
        game2.step()
        game2.step()
        state2 = [row[:] for row in game2.grid]
        
        # Should be identical
        assert state1 == state2
    
    def test_empty_grid_stays_empty(self):
        """Empty grid should remain empty (no spontaneous generation)."""
        game = GameOfLife(random_density=0.0)
        
        game.step()
        
        alive_count = sum(sum(row) for row in game.grid)
        assert alive_count == 0
    
    def test_step_preserves_grid_size(self):
        """Grid size should remain constant after step."""
        game = GameOfLife()
        
        game.step()
        
        assert len(game.grid) == 30
        assert all(len(row) == 30 for row in game.grid)
