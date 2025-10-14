"""Position domain object for Game of Life."""
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Position:
    """Represents a position in the grid.
    
    Attributes:
        row: Row index (0-based)
        col: Column index (0-based)
    """
    row: int
    col: int
    
    def neighbors(self) -> List['Position']:
        """Return all 8 neighboring positions.
        
        Returns positions in all 8 directions (including diagonals).
        Does not check if neighbors are within grid bounds.
        """
        return [
            Position(self.row + dr, self.col + dc)
            for dr in [-1, 0, 1]
            for dc in [-1, 0, 1]
            if not (dr == 0 and dc == 0)
        ]
    
    def __str__(self) -> str:
        """String representation of position."""
        return f"({self.row}, {self.col})"
