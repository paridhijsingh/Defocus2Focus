"""
Player class for Defocus2Focus game.
"""

import pygame
from typing import Tuple, Optional
from enum import Enum
from utils.settings import PLAYER_COLORS, PLAYER_SPEEDS, FOCUS_POWER, COLLISION
from utils.helpers import draw_health_bar


class FocusState(Enum):
    """Player focus states"""
    FOCUSED = "focused"
    DEFOCUSED = "defocused"
    TRANSITIONING = "transitioning"


class Player:
    """Player character with movement and focus mechanics"""
    
    def __init__(self, x: int, y: int, screen_width: int, screen_height: int):
        self.x = x
        self.y = y
        self.screen_width = screen_width
        self.screen_height = screen_height
        
        # Movement properties
        self.speed = PLAYER_SPEEDS["normal"]
        self.focused_speed = PLAYER_SPEEDS["focused"]
        self.defocused_speed = PLAYER_SPEEDS["defocused"]
        
        # Focus properties
        self.focus_state = FocusState.DEFOCUSED
        self.focus_power = FOCUS_POWER["max"]
        self.focus_drain_rate = FOCUS_POWER["drain_rate"]
        self.focus_regen_rate = FOCUS_POWER["regen_rate"]
        self.focus_transition_time = FOCUS_POWER["transition_time"]
        
        # Visual properties
        self.width = COLLISION["player_size"]
        self.height = COLLISION["player_size"]
        self.color_focused = PLAYER_COLORS["focused"]
        self.color_defocused = PLAYER_COLORS["defocused"]
        
        # Animation properties
        self.transition_timer = 0.0
        self.target_focus_state = None
        
        # Movement state
        self.moving_left = False
        self.moving_right = False
        self.moving_up = False
        self.moving_down = False
        
        # Effects
        self.slow_effect_timer = 0.0
        self.slow_effect_duration = 0.0
        self.slow_effect_intensity = 1.0
        
    def update(self, dt: float, keys_pressed: set) -> None:
        """Update player state and position"""
        self._handle_input(keys_pressed)
        self._update_focus(dt)
        self._update_position(dt)
        self._update_transition(dt)
        self._update_effects(dt)
        
    def _handle_input(self, keys_pressed: set) -> None:
        """Handle keyboard input for movement and focus"""
        # Focus toggle with F key
        if pygame.K_f in keys_pressed:
            self._toggle_focus()
            
        # Store movement keys for continuous movement
        self.moving_left = pygame.K_a in keys_pressed or pygame.K_LEFT in keys_pressed
        self.moving_right = pygame.K_d in keys_pressed or pygame.K_RIGHT in keys_pressed
        self.moving_up = pygame.K_w in keys_pressed or pygame.K_UP in keys_pressed
        self.moving_down = pygame.K_s in keys_pressed or pygame.K_DOWN in keys_pressed
        
    def _toggle_focus(self) -> None:
        """Toggle between focused and defocused states"""
        if self.focus_state == FocusState.TRANSITIONING:
            return
            
        if self.focus_state == FocusState.FOCUSED:
            self.target_focus_state = FocusState.DEFOCUSED
        else:
            self.target_focus_state = FocusState.FOCUSED
            
        self.focus_state = FocusState.TRANSITIONING
        self.transition_timer = self.focus_transition_time
        
    def _update_focus(self, dt: float) -> None:
        """Update focus power based on current state"""
        if self.focus_state == FocusState.FOCUSED:
            self.focus_power = max(0, self.focus_power - self.focus_drain_rate * dt)
            if self.focus_power <= 0:
                self._force_defocus()
        elif self.focus_state == FocusState.DEFOCUSED:
            self.focus_power = min(FOCUS_POWER["max"], self.focus_power + self.focus_regen_rate * dt)
            
    def _force_defocus(self) -> None:
        """Force player to defocus when focus power is depleted"""
        self.focus_state = FocusState.DEFOCUSED
        self.target_focus_state = None
        
    def _update_transition(self, dt: float) -> None:
        """Update focus state transition"""
        if self.focus_state == FocusState.TRANSITIONING:
            self.transition_timer -= dt
            if self.transition_timer <= 0:
                self.focus_state = self.target_focus_state
                self.target_focus_state = None
                
    def _update_position(self, dt: float) -> None:
        """Update player position based on movement input"""
        current_speed = self._get_current_speed()
        
        # Apply slow effect if active
        if self.slow_effect_timer > 0:
            current_speed *= self.slow_effect_intensity
        
        # Calculate movement
        dx = 0
        dy = 0
        
        if self.moving_left:
            dx -= current_speed * dt
        if self.moving_right:
            dx += current_speed * dt
        if self.moving_up:
            dy -= current_speed * dt
        if self.moving_down:
            dy += current_speed * dt
            
        # Apply movement
        new_x = self.x + dx
        new_y = self.y + dy
        
        # Boundary checking
        self.x = max(0, min(self.screen_width - self.width, new_x))
        self.y = max(0, min(self.screen_height - self.height, new_y))
        
    def _update_effects(self, dt: float) -> None:
        """Update active effects"""
        if self.slow_effect_timer > 0:
            self.slow_effect_timer -= dt
            if self.slow_effect_timer <= 0:
                self.slow_effect_intensity = 1.0
        
    def _get_current_speed(self) -> float:
        """Get current movement speed based on focus state"""
        if self.focus_state == FocusState.FOCUSED:
            return self.focused_speed
        return self.defocused_speed
        
    def get_rect(self) -> pygame.Rect:
        """Get player collision rectangle"""
        return pygame.Rect(self.x, self.y, self.width, self.height)
        
    def get_color(self) -> Tuple[int, int, int]:
        """Get current player color based on focus state"""
        if self.focus_state == FocusState.FOCUSED:
            return self.color_focused
        elif self.focus_state == FocusState.TRANSITIONING:
            # Blend colors during transition
            progress = 1 - (self.transition_timer / self.focus_transition_time)
            if self.target_focus_state == FocusState.FOCUSED:
                return self._blend_colors(self.color_defocused, self.color_focused, progress)
            else:
                return self._blend_colors(self.color_focused, self.color_defocused, progress)
        return self.color_defocused
        
    def _blend_colors(self, color1: Tuple[int, int, int], 
                     color2: Tuple[int, int, int], 
                     factor: float) -> Tuple[int, int, int]:
        """Blend between two colors"""
        r = int(color1[0] * (1 - factor) + color2[0] * factor)
        g = int(color1[1] * (1 - factor) + color2[1] * factor)
        b = int(color1[2] * (1 - factor) + color2[2] * factor)
        return (r, g, b)
        
    def draw(self, screen: pygame.Surface) -> None:
        """Draw the player on the screen"""
        color = self.get_color()
        pygame.draw.rect(screen, color, self.get_rect())
        
        # Draw focus power bar
        self._draw_focus_bar(screen)
        
        # Draw slow effect indicator
        if self.slow_effect_timer > 0:
            self._draw_slow_effect_indicator(screen)
        
    def _draw_focus_bar(self, screen: pygame.Surface) -> None:
        """Draw focus power bar above player"""
        bar_width = 40
        bar_height = 6
        bar_x = self.x - 4
        bar_y = self.y - 12
        
        # Background
        pygame.draw.rect(screen, (50, 50, 50), 
                        (bar_x, bar_y, bar_width, bar_height))
        
        # Focus power
        power_width = int((self.focus_power / FOCUS_POWER["max"]) * bar_width)
        power_color = (0, 255, 0) if self.focus_power > 20 else (255, 0, 0)
        pygame.draw.rect(screen, power_color, 
                        (bar_x, bar_y, power_width, bar_height))
                        
    def _draw_slow_effect_indicator(self, screen: pygame.Surface) -> None:
        """Draw slow effect indicator"""
        # Draw a small icon or text to show slow effect is active
        font = pygame.font.Font(None, 16)
        slow_text = font.render("SLOW", True, (255, 0, 0))
        text_rect = slow_text.get_rect(center=(self.x + self.width // 2, self.y - 25))
        screen.blit(slow_text, text_rect)
        
    def is_focused(self) -> bool:
        """Check if player is currently focused"""
        return self.focus_state == FocusState.FOCUSED
        
    def get_focus_power(self) -> float:
        """Get current focus power percentage"""
        return self.focus_power
        
    def can_use_focus_ability(self) -> bool:
        """Check if player can use focus abilities"""
        return self.focus_state == FocusState.FOCUSED and self.focus_power > 20
        
    def apply_slow_effect(self, duration: float, intensity: float) -> None:
        """Apply a slow effect to the player"""
        self.slow_effect_timer = duration
        self.slow_effect_intensity = intensity
        
    def take_damage(self, damage: int) -> None:
        """Player takes damage (could be expanded for health system)"""
        # For now, just force defocus
        if self.focus_state == FocusState.FOCUSED:
            self._force_defocus()
            
    def reset_position(self, x: int, y: int) -> None:
        """Reset player position"""
        self.x = x
        self.y = y
        
    def get_center_position(self) -> Tuple[int, int]:
        """Get player center position"""
        return (self.x + self.width // 2, self.y + self.height // 2)

