"""Game engine for Conway's Game of Life."""
import time
from domain.grid import Grid
from domain.generation import Generation
from domain.position import Position
from domain.cell import Cell
from rules.game_rules import GameRules
from display.console_display import ConsoleDisplay
from config.game_config import GameConfig


class GameEngine:
    """Orchestrates the Game of Life simulation.
    
    Responsible for:
    - Managing game state (grid and generation)
    - Coordinating between rules and display
    - Running the game loop
    - Handling user interruption
    """
    
    def __init__(self, grid: Grid, config: GameConfig):
        """Initialize the game engine.
        
        Args:
            grid: Initial game grid
            config: Game configuration
        """
        self.grid = grid
        self.generation = Generation(0)
        self.config = config
        self.rules = GameRules()
        self.display = ConsoleDisplay(config)
    
    def step(self) -> None:
        """Advance the game by one generation."""
        self.grid = self._calculate_next_generation()
        self.generation = self.generation.next()
    
    def run(self) -> None:
        """Run the game loop until interrupted by the user."""
        try:
            while True:
                self.display.render(self.grid, self.generation)
                time.sleep(self.config.delay)
                self.step()
        except KeyboardInterrupt:
            self.display.show_exit_message(self.generation)
    
    def _calculate_next_generation(self) -> Grid:
        """Calculate the next generation based on current state.
        
        Returns:
            New grid representing the next generation
        """
        grid_size = self.grid.size()
        new_grid = Grid(grid_size)
        
        for position in grid_size.all_positions():
            current_cell = self.grid.get_cell(position)
            neighbor_count = self.grid.count_living_neighbors(position)
            next_cell = self.rules.calculate_next_state(current_cell, neighbor_count)
            
            if next_cell.is_alive():
                new_grid.set_cell(position, next_cell)
        
        return new_grid
