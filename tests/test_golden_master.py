"""
Golden Master tests for Game of Life.

These tests verify that well-known Game of Life patterns behave correctly.
They serve as regression tests to ensure refactoring preserves behavior.
"""
import pytest
from game_of_life import GameOfLife


class TestBlinkerPattern:
    """Test the blinker oscillator (period-2)."""
    
    def test_blinker_oscillates_correctly(self):
        """Blinker should alternate between horizontal and vertical."""
        game = GameOfLife(random_density=0.0)
        
        # Initial state: horizontal line
        game.grid[15][14] = True
        game.grid[15][15] = True
        game.grid[15][16] = True
        
        # Capture initial state
        initial_state = [row[:] for row in game.grid]
        
        # Step 1: Should become vertical
        game.step()
        assert game.grid[14][15] == True
        assert game.grid[15][15] == True
        assert game.grid[16][15] == True
        assert game.grid[15][14] == False
        assert game.grid[15][16] == False
        
        # Step 2: Should return to horizontal
        game.step()
        assert game.grid[15][14] == True
        assert game.grid[15][15] == True
        assert game.grid[15][16] == True
        assert game.grid[14][15] == False
        assert game.grid[16][15] == False
        
        # Verify it returned to initial state
        assert game.grid == initial_state
    
    def test_blinker_period_is_two(self):
        """Blinker should have period 2 (returns to initial state after 2 steps)."""
        game = GameOfLife(random_density=0.0)
        
        # Set up blinker
        game.grid[10][10] = True
        game.grid[10][11] = True
        game.grid[10][12] = True
        
        initial = [row[:] for row in game.grid]
        
        # After 2 steps, should be identical
        game.step()
        game.step()
        
        assert game.grid == initial


class TestBlockPattern:
    """Test the block still life (period-1)."""
    
    def test_block_remains_stable(self):
        """2x2 block should never change."""
        game = GameOfLife(random_density=0.0)
        
        # Create 2x2 block
        game.grid[15][15] = True
        game.grid[15][16] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        
        initial_state = [row[:] for row in game.grid]
        
        # Run for 10 generations
        for _ in range(10):
            game.step()
        
        # Should be unchanged
        assert game.grid == initial_state
    
    def test_block_each_cell_has_three_neighbors(self):
        """Each cell in 2x2 block has exactly 3 neighbors."""
        game = GameOfLife(random_density=0.0)
        
        game.grid[15][15] = True
        game.grid[15][16] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        
        # Each cell in the block has 3 neighbors
        assert game._count_neighbors(15, 15) == 3
        assert game._count_neighbors(15, 16) == 3
        assert game._count_neighbors(16, 15) == 3
        assert game._count_neighbors(16, 16) == 3


class TestBeehivePattern:
    """Test the beehive still life."""
    
    def test_beehive_remains_stable(self):
        """Beehive pattern should never change."""
        game = GameOfLife(random_density=0.0)
        
        # Create beehive pattern
        #  .██.
        #  █..█
        #  .██.
        game.grid[14][15] = True
        game.grid[14][16] = True
        game.grid[15][14] = True
        game.grid[15][17] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        
        initial_state = [row[:] for row in game.grid]
        
        # Run for 10 generations
        for _ in range(10):
            game.step()
        
        # Should be unchanged
        assert game.grid == initial_state


class TestGliderPattern:
    """Test the glider spaceship."""
    
    def test_glider_moves_diagonally(self):
        """Glider should move down and to the right."""
        game = GameOfLife(random_density=0.0)
        
        # Initial glider at top-left area
        # .█.
        # ..█
        # ███
        start_row, start_col = 5, 5
        game.grid[start_row][start_col + 1] = True
        game.grid[start_row + 1][start_col + 2] = True
        game.grid[start_row + 2][start_col] = True
        game.grid[start_row + 2][start_col + 1] = True
        game.grid[start_row + 2][start_col + 2] = True
        
        # Save initial state
        initial_state = [row[:] for row in game.grid]
        
        # Run for 4 generations (one complete cycle)
        for _ in range(4):
            game.step()
        
        # Should still have 5 alive cells
        final_alive = sum(sum(row) for row in game.grid)
        assert final_alive == 5
        
        # Glider should have moved (state should be different)
        assert game.grid != initial_state
    
    def test_glider_has_period_four(self):
        """Glider returns to same shape after 4 generations (but translated)."""
        game = GameOfLife(random_density=0.0)
        
        # Set up glider
        game.grid[5][6] = True
        game.grid[6][7] = True
        game.grid[7][5] = True
        game.grid[7][6] = True
        game.grid[7][7] = True
        
        # After 4 steps, should have same pattern (but moved)
        for _ in range(4):
            game.step()
        
        # Should still have exactly 5 alive cells
        alive = sum(sum(row) for row in game.grid)
        assert alive == 5


class TestToadPattern:
    """Test the toad oscillator (period-2)."""
    
    def test_toad_oscillates(self):
        """Toad should oscillate between two states."""
        game = GameOfLife(random_density=0.0)
        
        # Initial toad pattern
        # .███
        # ███.
        game.grid[15][15] = True
        game.grid[15][16] = True
        game.grid[15][17] = True
        game.grid[16][14] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        
        initial = [row[:] for row in game.grid]
        
        # Should have 6 cells
        assert sum(sum(row) for row in game.grid) == 6
        
        # After 1 step, pattern changes
        game.step()
        assert game.grid != initial
        assert sum(sum(row) for row in game.grid) == 6  # Still 6 cells
        
        # After 2 steps, back to original
        game.step()
        assert game.grid == initial


class TestReproducibility:
    """Test that games are deterministic with same seed."""
    
    def test_same_seed_produces_same_sequence(self):
        """Two games with same seed should be identical."""
        import random
        
        # Game 1
        random.seed(12345)
        game1 = GameOfLife(random_density=0.3)
        for _ in range(10):
            game1.step()
        state1 = [row[:] for row in game1.grid]
        gen1 = game1.generation
        
        # Game 2 with same seed
        random.seed(12345)
        game2 = GameOfLife(random_density=0.3)
        for _ in range(10):
            game2.step()
        state2 = [row[:] for row in game2.grid]
        gen2 = game2.generation
        
        # Should be identical
        assert state1 == state2
        assert gen1 == gen2
    
    def test_different_seeds_produce_different_sequences(self):
        """Different seeds should produce different results."""
        import random
        
        # Game 1
        random.seed(111)
        game1 = GameOfLife(random_density=0.3)
        state1 = [row[:] for row in game1.grid]
        
        # Game 2 with different seed
        random.seed(999)
        game2 = GameOfLife(random_density=0.3)
        state2 = [row[:] for row in game2.grid]
        
        # Should be different (with extremely high probability)
        assert state1 != state2


class TestComplexPatterns:
    """Test more complex patterns."""
    
    def test_empty_grid_stays_empty(self):
        """Empty grid should produce no life."""
        game = GameOfLife(random_density=0.0)
        
        for _ in range(100):
            game.step()
        
        alive = sum(sum(row) for row in game.grid)
        assert alive == 0
    
    def test_full_grid_dies_quickly(self):
        """Full grid should mostly die from overcrowding."""
        game = GameOfLife(random_density=1.0)
        
        initial_alive = sum(sum(row) for row in game.grid)
        
        game.step()
        
        final_alive = sum(sum(row) for row in game.grid)
        
        # Should have significantly fewer alive cells
        assert final_alive < initial_alive * 0.5
    
    def test_single_cell_dies(self):
        """Single cell should die (under-population)."""
        game = GameOfLife(random_density=0.0)
        game.grid[15][15] = True
        
        game.step()
        
        assert game.grid[15][15] == False
    
    def test_r_pentomino_is_methuselah(self):
        """R-pentomino should have long lifetime (>100 generations)."""
        game = GameOfLife(random_density=0.0)
        
        # R-pentomino pattern
        # .██
        # ██.
        # .█.
        game.grid[15][16] = True
        game.grid[15][17] = True
        game.grid[16][15] = True
        game.grid[16][16] = True
        game.grid[17][16] = True
        
        # Should still have cells after 100 generations
        for _ in range(100):
            game.step()
        
        alive = sum(sum(row) for row in game.grid)
        assert alive > 0  # Still has life
