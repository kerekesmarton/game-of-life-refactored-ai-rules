"""Cell domain object for Game of Life."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    """Represents a single cell in the Game of Life.
    
    Attributes:
        alive: Whether the cell is alive or dead
    """
    alive: bool
    
    @classmethod
    def alive_cell(cls) -> 'Cell':
        """Create an alive cell."""
        return cls(alive=True)
    
    @classmethod
    def dead_cell(cls) -> 'Cell':
        """Create a dead cell."""
        return cls(alive=False)
    
    def is_alive(self) -> bool:
        """Check if the cell is alive."""
        return self.alive
    
    def is_dead(self) -> bool:
        """Check if the cell is dead."""
        return not self.alive
