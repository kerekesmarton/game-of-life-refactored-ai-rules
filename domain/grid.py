"""Grid first-class collection for Game of Life."""
from typing import Dict, Set
from domain.cell import Cell
from domain.position import Position
from domain.grid_size import GridSize


class Grid:
    """First-class collection representing the game grid.
    
    Encapsulates the 2D grid of cells and provides operations
    for querying and manipulating cell states.
    """
    
    def __init__(self, size: GridSize):
        """Initialize grid with given size.
        
        Args:
            size: Dimensions of the grid
        """
        self._size = size
        self._cells: Dict[Position, Cell] = {}
        self._initialize_empty()
    
    def _initialize_empty(self) -> None:
        """Initialize all cells as dead."""
        for position in self._size.all_positions():
            self._cells[position] = Cell.dead_cell()
    
    def set_cell(self, position: Position, cell: Cell) -> None:
        """Set the state of a cell at position.
        
        Args:
            position: Position to set
            cell: Cell state to set
            
        Raises:
            ValueError: If position is out of bounds
        """
        if not self._size.contains(position):
            raise ValueError(f"Position {position} out of bounds")
        self._cells[position] = cell
    
    def get_cell(self, position: Position) -> Cell:
        """Get the cell at position.
        
        Args:
            position: Position to get
            
        Returns:
            Cell at the position, or dead cell if out of bounds
        """
        if not self._size.contains(position):
            return Cell.dead_cell()
        return self._cells.get(position, Cell.dead_cell())
    
    def count_living_neighbors(self, position: Position) -> int:
        """Count living neighbors for a position.
        
        Args:
            position: Position to count neighbors for
            
        Returns:
            Number of living neighbors (0-8)
        """
        return sum(1 for neighbor in position.neighbors()
                   if self._size.contains(neighbor)
                   and self.get_cell(neighbor).is_alive())
    
    def living_cells(self) -> Set[Position]:
        """Return all positions with living cells.
        
        Returns:
            Set of positions containing alive cells
        """
        return {pos for pos, cell in self._cells.items()
                if cell.is_alive()}
    
    def size(self) -> GridSize:
        """Return the grid size.
        
        Returns:
            GridSize instance
        """
        return self._size
