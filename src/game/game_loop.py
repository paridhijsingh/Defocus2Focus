"""
Main game loop for Defocus2Focus game.
"""

import pygame
import sys
from typing import Dict, Optional
from enum import Enum
from game.player import Player
from game.levels import LevelManager
from utils.settings import WINDOW_WIDTH, WINDOW_HEIGHT, FPS
from utils.helpers import debug_fps_counter, check_collision


class GameState(Enum):
    """Game states"""
    MENU = "menu"
    PLAYING = "playing"
    PAUSED = "paused"
    GAME_OVER = "game_over"
    LEVEL_COMPLETE = "level_complete"
    VICTORY = "victory"


class GameLoop:
    """Main game loop that orchestrates all game systems"""
    
    def __init__(self, screen: pygame.Surface, clock: pygame.time.Clock):
        self.screen = screen
        self.clock = clock
        self.running = True
        
        # Game state
        self.game_state = GameState.MENU
        self.previous_state = GameState.MENU
        
        # Game systems
        self.level_manager = LevelManager()
        self.player = None
        self.current_level = None
        
        # Input handling
        self.keys_pressed = set()
        self.mouse_pos = (0, 0)
        self.mouse_clicked = False
        
        # Game timing
        self.dt = 0.0
        self.fps = 0.0
        
        # UI elements
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 36)
        self.font_small = pygame.font.Font(None, 24)
        
        # Initialize game
        self._init_game()
        
    def _init_game(self) -> None:
        """Initialize game systems"""
        # Create player
        self.player = Player(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2, WINDOW_WIDTH, WINDOW_HEIGHT)
        
        # Setup current level
        self.current_level = self.level_manager.get_current_level()
        self.current_level.setup(WINDOW_WIDTH, WINDOW_HEIGHT)
        
        # Reset player position to level start
        self.player.reset_position(*self.current_level.player_start_pos)
        
    def run(self) -> None:
        """Main game loop"""
        while self.running:
            self._handle_events()
            self._update()
            self._render()
            self.clock.tick(FPS)
            
    def _handle_events(self) -> None:
        """Handle pygame events"""
        self.mouse_clicked = False
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                
            elif event.type == pygame.KEYDOWN:
                self._handle_keydown(event.key)
                
            elif event.type == pygame.KEYUP:
                self._handle_keyup(event.key)
                
            elif event.type == pygame.MOUSEMOTION:
                self.mouse_pos = event.pos
                
            elif event.type == pygame.MOUSEBUTTONDOWN:
                self.mouse_clicked = True
                
        # Update keys_pressed set for continuous movement
        self.keys_pressed = set(pygame.key.get_pressed())
                
    def _handle_keydown(self, key: int) -> None:
        """Handle key press events"""
        if key == pygame.K_ESCAPE:
            self._toggle_pause()
        elif key == pygame.K_r:
            self._restart_level()
        elif key == pygame.K_q:
            self._quit_to_menu()
        elif key == pygame.K_SPACE and self.game_state == GameState.MENU:
            self._start_game()
            
    def _handle_keyup(self, key: int) -> None:
        """Handle key release events"""
        pass
        
    def _toggle_pause(self) -> None:
        """Toggle between playing and paused states"""
        if self.game_state == GameState.PLAYING:
            self.previous_state = self.game_state
            self.game_state = GameState.PAUSED
        elif self.game_state == GameState.PAUSED:
            self.game_state = self.previous_state
            
    def _restart_level(self) -> None:
        """Restart the current level"""
        if self.game_state == GameState.PLAYING:
            self.current_level.reset()
            self.player.reset_position(*self.current_level.player_start_pos)
            
    def _quit_to_menu(self) -> None:
        """Return to main menu"""
        self.game_state = GameState.MENU
        self._init_game()
        
    def _start_game(self) -> None:
        """Start the game"""
        self.game_state = GameState.PLAYING
        
    def _update(self) -> None:
        """Update game state"""
        # Calculate delta time
        self.dt = self.clock.get_time() / 1000.0
        self.fps = self.clock.get_fps()
        
        if self.game_state == GameState.PLAYING:
            self._update_gameplay()
        elif self.game_state == GameState.LEVEL_COMPLETE:
            self._handle_level_complete()
            
    def _update_gameplay(self) -> None:
        """Update gameplay systems"""
        # Update player
        self.player.update(self.dt, self.keys_pressed)
        
        # Update level
        self.current_level.update(self.dt, self.player)
        
        # Check collisions
        self._check_collisions()
        
        # Check level completion
        if self.current_level.completed:
            self.game_state = GameState.LEVEL_COMPLETE
            
        # Check game over conditions
        if self._check_game_over():
            self.game_state = GameState.GAME_OVER
            
    def _check_collisions(self) -> None:
        """Check all collisions in the game"""
        # Player vs Obstacles
        for obstacle in self.current_level.get_obstacles():
            if obstacle.is_collidable() and check_collision(self.player.get_rect(), obstacle.get_rect()):
                self._handle_obstacle_collision(obstacle)
                
        # Player vs Enemies
        for enemy in self.current_level.get_enemies():
            if check_collision(self.player.get_rect(), enemy.get_rect()):
                self._handle_enemy_collision(enemy)
                
    def _handle_obstacle_collision(self, obstacle) -> None:
        """Handle player collision with obstacle"""
        effect = obstacle.get_collision_effect()
        
        if effect["type"] == "death":
            self.game_state = GameState.GAME_OVER
        elif effect["type"] == "block":
            # Push player back (simple collision response)
            self._push_player_away(obstacle)
            
    def _handle_enemy_collision(self, enemy) -> None:
        """Handle player collision with enemy"""
        effect = enemy.get_effect()
        
        if effect["type"] == "slow":
            self.player.apply_slow_effect(effect["duration"], effect["intensity"])
        elif effect["type"] == "defocus":
            # Force player to defocus
            if self.player.is_focused():
                # This would need to be implemented in Player class
                pass
        elif effect["type"] == "time_drain":
            # Reduce time remaining
            if self.current_level.time_remaining:
                self.current_level.time_remaining -= effect["duration"]
                
        # Player takes damage
        self.player.take_damage(10)
        
    def _push_player_away(self, obstacle) -> None:
        """Simple collision response - push player away from obstacle"""
        player_rect = self.player.get_rect()
        obstacle_rect = obstacle.get_rect()
        
        # Calculate overlap
        overlap_x = min(player_rect.right - obstacle_rect.left, obstacle_rect.right - player_rect.left)
        overlap_y = min(player_rect.bottom - obstacle_rect.top, obstacle_rect.bottom - player_rect.top)
        
        # Push in direction of least overlap
        if overlap_x < overlap_y:
            if player_rect.centerx < obstacle_rect.centerx:
                self.player.x -= overlap_x
            else:
                self.player.x += overlap_x
        else:
            if player_rect.centery < obstacle_rect.centery:
                self.player.y -= overlap_y
            else:
                self.player.y += overlap_y
                
    def _check_game_over(self) -> bool:
        """Check if game over conditions are met"""
        # Time ran out
        if (self.current_level.time_limit and 
            self.current_level.time_remaining is not None and 
            self.current_level.time_remaining <= 0):
            return True
            
        # Player fell into pit (handled in collision)
        # Player health depleted (if implemented)
        
        return False
        
    def _handle_level_complete(self) -> None:
        """Handle level completion"""
        # Check if this was the last level
        if self.level_manager.current_level_index >= len(self.level_manager.levels) - 1:
            self.game_state = GameState.VICTORY
        else:
            # Advance to next level
            if self.level_manager.next_level():
                self.current_level = self.level_manager.get_current_level()
                self.current_level.setup(WINDOW_WIDTH, WINDOW_HEIGHT)
                self.player.reset_position(*self.current_level.player_start_pos)
                self.game_state = GameState.PLAYING
                
    def _render(self) -> None:
        """Render the current game state"""
        if self.game_state == GameState.MENU:
            self._render_menu()
        elif self.game_state == GameState.PLAYING:
            self._render_gameplay()
        elif self.game_state == GameState.PAUSED:
            self._render_paused()
        elif self.game_state == GameState.GAME_OVER:
            self._render_game_over()
        elif self.game_state == GameState.LEVEL_COMPLETE:
            self._render_level_complete()
        elif self.game_state == GameState.VICTORY:
            self._render_victory()
            
        # Always render debug info
        debug_fps_counter(self.screen, self.fps)
        
        pygame.display.flip()
        
    def _render_menu(self) -> None:
        """Render main menu"""
        self.screen.fill((50, 50, 100))
        
        # Title
        title = self.font_large.render("Defocus2Focus", True, (255, 255, 255))
        title_rect = title.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3))
        self.screen.blit(title, title_rect)
        
        # Subtitle
        subtitle = self.font_medium.render("Focus Management Game", True, (200, 200, 200))
        subtitle_rect = subtitle.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3 + 60))
        self.screen.blit(subtitle, subtitle_rect)
        
        # Instructions
        instructions = self.font_small.render("Press SPACE to start", True, (255, 255, 255))
        instructions_rect = instructions.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT * 2 // 3))
        self.screen.blit(instructions, instructions_rect)
        
    def _render_gameplay(self) -> None:
        """Render gameplay"""
        # Draw level
        self.current_level.draw(self.screen)
        
        # Draw player
        self.player.draw(self.screen)
        
        # Draw UI overlay
        self._render_gameplay_ui()
        
    def _render_gameplay_ui(self) -> None:
        """Render gameplay UI elements"""
        # Level info
        level_text = self.font_small.render(f"Level {self.current_level.level_number}: {self.current_level.name}", True, (255, 255, 255))
        self.screen.blit(level_text, (WINDOW_WIDTH - 300, 20))
        
        # Focus power
        focus_text = self.font_small.render(f"Focus: {self.player.get_focus_power():.0f}%", True, (255, 255, 255))
        self.screen.blit(focus_text, (WINDOW_WIDTH - 300, 50))
        
        # Focus state
        state_text = self.font_small.render(f"State: {self.player.focus_state.value}", True, (255, 255, 255))
        self.screen.blit(state_text, (WINDOW_WIDTH - 300, 80))
        
    def _render_paused(self) -> None:
        """Render paused state"""
        # Draw gameplay in background
        self._render_gameplay()
        
        # Draw pause overlay
        overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
        overlay.set_alpha(128)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))
        
        # Pause text
        pause_text = self.font_large.render("PAUSED", True, (255, 255, 255))
        pause_rect = pause_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
        self.screen.blit(pause_text, pause_rect)
        
        # Instructions
        instructions = self.font_small.render("Press ESC to resume", True, (255, 255, 255))
        instructions_rect = instructions.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 60))
        self.screen.blit(instructions, instructions_rect)
        
    def _render_game_over(self) -> None:
        """Render game over screen"""
        self.screen.fill((100, 0, 0))
        
        # Game over text
        game_over_text = self.font_large.render("GAME OVER", True, (255, 255, 255))
        game_over_rect = game_over_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3))
        self.screen.blit(game_over_text, game_over_rect)
        
        # Instructions
        instructions = self.font_small.render("Press R to restart or Q for menu", True, (255, 255, 255))
        instructions_rect = instructions.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT * 2 // 3))
        self.screen.blit(instructions, instructions_rect)
        
    def _render_level_complete(self) -> None:
        """Render level complete screen"""
        self.screen.fill((0, 100, 0))
        
        # Level complete text
        complete_text = self.font_large.render("LEVEL COMPLETE!", True, (255, 255, 255))
        complete_rect = complete_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3))
        self.screen.blit(complete_text, complete_rect)
        
        # Score
        score_text = self.font_medium.render(f"Score: {self.current_level.score}", True, (255, 255, 255))
        score_rect = score_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3 + 60))
        self.screen.blit(score_text, score_rect)
        
        # Instructions
        instructions = self.font_small.render("Press SPACE to continue", True, (255, 255, 255))
        instructions_rect = instructions.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT * 2 // 3))
        self.screen.blit(instructions, instructions_rect)
        
    def _render_victory(self) -> None:
        """Render victory screen"""
        self.screen.fill((100, 100, 0))
        
        # Victory text
        victory_text = self.font_large.render("VICTORY!", True, (255, 255, 255))
        victory_rect = victory_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3))
        self.screen.blit(victory_text, victory_rect)
        
        # Congratulations
        congrats_text = self.font_medium.render("You've mastered focus management!", True, (255, 255, 255))
        congrats_rect = congrats_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 3 + 60))
        self.screen.blit(congrats_text, congrats_rect)
        
        # Instructions
        instructions = self.font_small.render("Press Q to return to menu", True, (255, 255, 255))
        instructions_rect = instructions.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT * 2 // 3))
        self.screen.blit(instructions, instructions_rect)
