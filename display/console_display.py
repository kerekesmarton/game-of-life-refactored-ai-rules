"""Console display for Game of Life."""
import os
from domain.grid import Grid
from domain.generation import Generation
from domain.position import Position
from config.game_config import GameConfig


class ConsoleDisplay:
    """Handles console rendering of the Game of Life.
    
    Responsible for all display-related operations including
    clearing the screen, rendering the grid, and showing game state.
    """
    
    def __init__(self, config: GameConfig):
        """Initialize the console display.
        
        Args:
            config: Game configuration
        """
        self.config = config
    
    def clear_screen(self) -> None:
        """Clear the terminal screen."""
        os.system(self.config.clear_command)
    
    def render(self, grid: Grid, generation: Generation) -> None:
        """Render the complete game state to console.
        
        Args:
            grid: The game grid to display
            generation: Current generation number
        """
        self.clear_screen()
        self._render_header(generation)
        self._render_grid(grid)
        self._render_footer()
    
    def _render_header(self, generation: Generation) -> None:
        """Render the header with game title and generation."""
        width = self.config.grid_size * 2
        print("╔" + "═" * width + "╗")
        print(f"║  Conway's Game of Life - Generation {generation:>8}  ║")
        print("╠" + "═" * width + "╣")
    
    def _render_grid(self, grid: Grid) -> None:
        """Render the grid cells."""
        grid_size = grid.size()
        for row in range(grid_size.height):
            print("║", end="")
            for col in range(grid_size.width):
                position = Position(row, col)
                cell = grid.get_cell(position)
                char = self.config.alive_char if cell.is_alive() else self.config.dead_char
                print(char * 2, end="")
            print("║")
    
    def _render_footer(self) -> None:
        """Render the footer with instructions."""
        width = self.config.grid_size * 2
        print("╚" + "═" * width + "╝")
        print("\nPress Ctrl+C to stop")
    
    def show_exit_message(self, generation: Generation) -> None:
        """Show graceful exit message.
        
        Args:
            generation: Final generation number
        """
        print(f"\n\nGame stopped at generation {generation}")
        print("Thanks for playing!")
