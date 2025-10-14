"""Pytest configuration and shared fixtures."""
import pytest
import sys
from pathlib import Path

# Add parent directory to path so we can import game_of_life
sys.path.insert(0, str(Path(__file__).parent.parent))

from game_of_life import GameOfLife


@pytest.fixture
def empty_game():
    """Create a game with all dead cells."""
    game = GameOfLife(random_density=0.0)
    return game


@pytest.fixture
def full_game():
    """Create a game with all alive cells."""
    game = GameOfLife(random_density=1.0)
    return game


@pytest.fixture
def known_seed_game():
    """Create a game with a known random seed for reproducibility."""
    import random
    random.seed(42)
    game = GameOfLife(random_density=0.3)
    return game
