"""
Defocus2Focus - Main Game Entry Point

This is the main entry point that launches the Defocus2Focus game.
It initializes pygame, sets up the game window, and starts the main game loop.

To run the game:
    python main.py

Game Controls:
    WASD or Arrow Keys - Move player
    F - Toggle focus/defocus state
    ESC - Pause/Resume game
    R - Restart current level
    Q - Quit to main menu
"""

import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def main():
    """Main game entry point"""
    try:
        # Import game components
        from game.game_loop import GameLoop
        from utils.settings import WINDOW_WIDTH, WINDOW_HEIGHT, FPS, TITLE
        
        # Initialize pygame
        import pygame
        pygame.init()
        
        # Set up display
        screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption(TITLE)
        clock = pygame.time.Clock()
        
        # Create and run game loop
        game = GameLoop(screen, clock)
        game.run()
        
    except ImportError as e:
        print(f"Error importing game modules: {e}")
        print("Make sure all required dependencies are installed:")
        print("pip install -r requirements.txt")
        sys.exit(1)
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
        
    finally:
        pygame.quit()
        sys.exit(0)

if __name__ == "__main__":
    main()
