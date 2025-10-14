"""GridSize domain object for Game of Life."""
from dataclasses import dataclass
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from domain.position import Position


@dataclass(frozen=True)
class GridSize:
    """Represents the dimensions of the grid.
    
    Attributes:
        width: Grid width (number of columns)
        height: Grid height (number of rows)
    """
    width: int
    height: int
    
    def contains(self, position: 'Position') -> bool:
        """Check if position is within grid bounds.
        
        Args:
            position: Position to check
            
        Returns:
            True if position is within bounds, False otherwise
        """
        return (0 <= position.row < self.height and
                0 <= position.col < self.width)
    
    def all_positions(self) -> List['Position']:
        """Return all positions in the grid.
        
        Returns:
            List of all valid positions in row-major order
        """
        from domain.position import Position
        return [Position(row, col)
                for row in range(self.height)
                for col in range(self.width)]
