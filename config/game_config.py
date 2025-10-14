"""Game of Life configuration."""
from dataclasses import dataclass


@dataclass(frozen=True)
class GameConfig:
    """Configuration for Game of Life.
    
    Attributes:
        grid_size: Size of the grid (width and height)
        alive_char: Character to display for alive cells
        dead_char: Character to display for dead cells
        delay: Delay between generations in seconds
        initial_density: Initial probability of cells being alive (0.0-1.0)
        clear_command: OS command to clear the screen
    """
    grid_size: int = 30
    alive_char: str = '█'
    dead_char: str = ' '
    delay: float = 0.15
    initial_density: float = 0.3
    clear_command: str = 'clear'
    
    def __post_init__(self):
        """Validate configuration values."""
        if not 0.0 <= self.initial_density <= 1.0:
            raise ValueError(f"Density must be between 0 and 1, got {self.initial_density}")
        if self.grid_size < 1:
            raise ValueError(f"Grid size must be positive, got {self.grid_size}")
        if self.delay < 0:
            raise ValueError(f"Delay must be non-negative, got {self.delay}")
