"""Conway's Game of Life rules implementation."""
from domain.cell import Cell


class GameRules:
    """Pure logic implementation of Conway's Game of Life rules.
    
    Rules:
    1. Any live cell with fewer than two live neighbours dies (under-population)
    2. Any live cell with two or three live neighbours lives on
    3. Any live cell with more than three live neighbours dies (over-population)
    4. Any dead cell with exactly three live neighbours becomes alive (reproduction)
    """
    
    @staticmethod
    def calculate_next_state(current_cell: Cell, living_neighbors: int) -> Cell:
        """Calculate the next state of a cell based on Conway's rules.
        
        Args:
            current_cell: The current state of the cell
            living_neighbors: Number of living neighbors (0-8)
            
        Returns:
            The next state of the cell
        """
        if current_cell.is_alive():
            return GameRules._apply_survival_rules(living_neighbors)
        else:
            return GameRules._apply_birth_rules(living_neighbors)
    
    @staticmethod
    def _apply_survival_rules(living_neighbors: int) -> Cell:
        """Apply survival rules for living cells."""
        if living_neighbors in [2, 3]:
            return Cell.alive_cell()
        return Cell.dead_cell()
    
    @staticmethod
    def _apply_birth_rules(living_neighbors: int) -> Cell:
        """Apply birth rules for dead cells."""
        if living_neighbors == 3:
            return Cell.alive_cell()
        return Cell.dead_cell()
