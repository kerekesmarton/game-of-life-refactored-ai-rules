"""Generation domain object for Game of Life."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Generation:
    """Represents a generation number.
    
    Attributes:
        number: The generation number (0-based)
    """
    number: int
    
    def next(self) -> 'Generation':
        """Get the next generation.
        
        Returns:
            New Generation instance with incremented number
        """
        return Generation(self.number + 1)
    
    def __str__(self) -> str:
        """String representation of generation."""
        return str(self.number)
    
    def __format__(self, format_spec: str) -> str:
        """Format generation number."""
        return format(self.number, format_spec)
