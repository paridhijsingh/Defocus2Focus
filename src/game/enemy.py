"""
Enemy and obstacle classes for Defocus2Focus game.
"""

import pygame
import random
import math
from typing import Tuple, List, Optional
from enum import Enum
from utils.settings import ENEMY_COLORS, OBSTACLE_COLORS, ENEMY_SETTINGS, COLLISION
from utils.helpers import draw_health_bar, random_position, random_enemy_type


class EnemyType(Enum):
    """Types of enemies"""
    DISTRACTION = "distraction"      # Slows player down
    INTERRUPTION = "interruption"    # Forces defocus
    TIME_PRESSURE = "time_pressure"  # Creates urgency


class ObstacleType(Enum):
    """Types of obstacles"""
    WALL = "wall"
    PIT = "pit"
    MOVING_PLATFORM = "moving_platform"


class Enemy:
    """Base enemy class"""
    
    def __init__(self, x: int, y: int, enemy_type: EnemyType):
        self.x = x
        self.y = y
        self.enemy_type = enemy_type
        self.width = COLLISION["enemy_size"]
        self.height = COLLISION["enemy_size"]
        self.active = True
        self.health = ENEMY_SETTINGS["health"]
        self.max_health = ENEMY_SETTINGS["health"]
        
        # Movement properties
        self.speed = ENEMY_SETTINGS["speed"]
        self.direction = random.uniform(0, 2 * math.pi)
        self.change_direction_timer = 0
        self.direction_change_interval = 3.0
        
        # Visual properties
        self.color = self._get_color_by_type()
        self.animation_timer = 0
        
    def _get_color_by_type(self) -> Tuple[int, int, int]:
        """Get enemy color based on type"""
        if self.enemy_type == EnemyType.DISTRACTION:
            return ENEMY_COLORS["distraction"]
        elif self.enemy_type == EnemyType.INTERRUPTION:
            return ENEMY_COLORS["interruption"]
        elif self.enemy_type == EnemyType.TIME_PRESSURE:
            return ENEMY_COLORS["time_pressure"]
        return (128, 128, 128)  # Default gray
        
    def update(self, dt: float, player_pos: Tuple[int, int]) -> None:
        """Update enemy state and position"""
        if not self.active:
            return
            
        self._update_movement(dt, player_pos)
        self._update_animation(dt)
        
    def _update_movement(self, dt: float, player_pos: Tuple[int, int]) -> None:
        """Update enemy movement"""
        # Change direction randomly
        self.change_direction_timer += dt
        if self.change_direction_timer >= self.direction_change_interval:
            self.direction = random.uniform(0, 2 * math.pi)
            self.change_direction_timer = 0
            
        # Move in current direction
        dx = math.cos(self.direction) * self.speed * dt
        dy = math.sin(self.direction) * self.speed * dt
        
        self.x += dx
        self.y += dy
        
        # Keep enemy within bounds (simple boundary)
        self.x = max(0, min(800 - self.width, self.x))
        self.y = max(0, min(600 - self.height, self.y))
        
    def _update_animation(self, dt: float) -> None:
        """Update animation state"""
        self.animation_timer += dt
        
    def get_rect(self) -> pygame.Rect:
        """Get enemy collision rectangle"""
        return pygame.Rect(self.x, self.y, self.width, self.height)
        
    def draw(self, screen: pygame.Surface) -> None:
        """Draw the enemy on the screen"""
        if not self.active:
            return
            
        # Draw enemy body
        pygame.draw.rect(screen, self.color, self.get_rect())
        
        # Draw health bar
        self._draw_health_bar(screen)
        
        # Draw type indicator
        self._draw_type_indicator(screen)
        
    def _draw_health_bar(self, screen: pygame.Surface) -> None:
        """Draw health bar above enemy"""
        bar_width = 30
        bar_height = 4
        bar_x = self.x - 3
        bar_y = self.y - 8
        
        # Background
        pygame.draw.rect(screen, (50, 50, 50), 
                        (bar_x, bar_y, bar_width, bar_height))
        
        # Health
        health_width = int((self.health / self.max_health) * bar_width)
        health_color = (0, 255, 0) if self.health > 50 else (255, 255, 0) if self.health > 25 else (255, 0, 0)
        pygame.draw.rect(screen, health_color, 
                        (bar_x, bar_y, health_width, bar_height))
                        
    def _draw_type_indicator(self, screen: pygame.Surface) -> None:
        """Draw visual indicator for enemy type"""
        center_x = self.x + self.width // 2
        center_y = self.y + self.height // 2
        
        if self.enemy_type == EnemyType.DISTRACTION:
            # Draw question mark
            font = pygame.font.Font(None, 20)
            text = font.render("?", True, (0, 0, 0))
            text_rect = text.get_rect(center=(center_x, center_y))
            screen.blit(text, text_rect)
        elif self.enemy_type == EnemyType.INTERRUPTION:
            # Draw exclamation mark
            font = pygame.font.Font(None, 20)
            text = font.render("!", True, (0, 0, 0))
            text_rect = text.get_rect(center=(center_x, center_y))
            screen.blit(text, text_rect)
        elif self.enemy_type == EnemyType.TIME_PRESSURE:
            # Draw clock symbol
            font = pygame.font.Font(None, 20)
            text = font.render("⏰", True, (0, 0, 0))
            text_rect = text.get_rect(center=(center_x, center_y))
            screen.blit(text, text_rect)
            
    def take_damage(self, damage: int) -> bool:
        """Take damage and return True if destroyed"""
        self.health -= damage
        if self.health <= 0:
            self.active = False
            return True
        return False
        
    def get_effect(self) -> dict:
        """Get the effect this enemy has on the player"""
        if self.enemy_type == EnemyType.DISTRACTION:
            return {"type": "slow", "duration": 3.0, "intensity": 0.5}
        elif self.enemy_type == EnemyType.INTERRUPTION:
            return {"type": "defocus", "duration": 2.0, "intensity": 1.0}
        elif self.enemy_type == EnemyType.TIME_PRESSURE:
            return {"type": "time_drain", "duration": 5.0, "intensity": 0.3}
        return {}


class Obstacle:
    """Base obstacle class"""
    
    def __init__(self, x: int, y: int, width: int, height: int, obstacle_type: ObstacleType):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.obstacle_type = obstacle_type
        self.active = True
        
        # Visual properties
        self.color = self._get_color_by_type()
        
        # Movement properties (for moving platforms)
        self.original_x = x
        self.original_y = y
        self.move_range = 100
        self.move_speed = 1
        self.move_timer = 0
        
    def _get_color_by_type(self) -> Tuple[int, int, int]:
        """Get obstacle color based on type"""
        if self.obstacle_type == ObstacleType.WALL:
            return OBSTACLE_COLORS["wall"]
        elif self.obstacle_type == ObstacleType.PIT:
            return OBSTACLE_COLORS["pit"]
        elif self.obstacle_type == ObstacleType.MOVING_PLATFORM:
            return OBSTACLE_COLORS["moving_platform"]
        return (128, 128, 128)  # Default gray
        
    def update(self, dt: float) -> None:
        """Update obstacle state"""
        if self.obstacle_type == ObstacleType.MOVING_PLATFORM:
            self._update_movement(dt)
            
    def _update_movement(self, dt: float) -> None:
        """Update moving platform movement"""
        self.move_timer += dt
        
        # Simple back-and-forth movement
        progress = (math.sin(self.move_timer * self.move_speed) + 1) / 2
        self.x = self.original_x + progress * self.move_range
        
    def get_rect(self) -> pygame.Rect:
        """Get obstacle collision rectangle"""
        return pygame.Rect(self.x, self.y, self.width, self.height)
        
    def draw(self, screen: pygame.Surface) -> None:
        """Draw the obstacle on the screen"""
        if not self.active:
            return
            
        if self.obstacle_type == ObstacleType.PIT:
            # Draw pit with depth effect
            pygame.draw.rect(screen, (0, 0, 0), self.get_rect())
            pygame.draw.rect(screen, (64, 64, 64), 
                           (self.x + 2, self.y + 2, self.width - 4, self.height - 4))
        else:
            pygame.draw.rect(screen, self.color, self.get_rect())
            
        # Draw type indicator for moving platforms
        if self.obstacle_type == ObstacleType.MOVING_PLATFORM:
            self._draw_movement_indicator(screen)
            
    def _draw_movement_indicator(self, screen: pygame.Surface) -> None:
        """Draw movement indicator for moving platforms"""
        center_x = self.x + self.width // 2
        center_y = self.y + self.height // 2
        
        # Draw arrow indicating movement direction
        arrow_color = (255, 255, 255)
        if self.x > self.original_x:
            # Moving right
            pygame.draw.polygon(screen, arrow_color, [
                (center_x - 5, center_y - 3),
                (center_x + 5, center_y),
                (center_x - 5, center_y + 3)
            ])
        else:
            # Moving left
            pygame.draw.polygon(screen, arrow_color, [
                (center_x + 5, center_y - 3),
                (center_x - 5, center_y),
                (center_x + 5, center_y + 3)
            ])
            
    def is_collidable(self) -> bool:
        """Check if obstacle can be collided with"""
        return self.obstacle_type != ObstacleType.PIT
        
    def get_collision_effect(self) -> dict:
        """Get the effect of colliding with this obstacle"""
        if self.obstacle_type == ObstacleType.PIT:
            return {"type": "death", "message": "Fell into pit!"}
        elif self.obstacle_type == ObstacleType.WALL:
            return {"type": "block", "message": "Cannot pass through wall"}
        elif self.obstacle_type == ObstacleType.MOVING_PLATFORM:
            return {"type": "platform", "message": "Standing on moving platform"}
        return {}


class EnemySpawner:
    """Manages spawning of enemies"""
    
    def __init__(self, screen_width: int, screen_height: int):
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.spawn_timer = 0
        self.spawn_interval = ENEMY_SETTINGS["spawn_interval"]
        self.max_enemies = ENEMY_SETTINGS["max_count"]
        self.enemies: List[Enemy] = []
        
    def update(self, dt: float, player_pos: Tuple[int, int]) -> None:
        """Update spawner and all enemies"""
        self._update_spawning(dt)
        
        # Update existing enemies
        for enemy in self.enemies[:]:
            enemy.update(dt, player_pos)
            if not enemy.active:
                self.enemies.remove(enemy)
                
    def _update_spawning(self, dt: float) -> None:
        """Update enemy spawning logic"""
        self.spawn_timer += dt
        
        if self.spawn_timer >= self.spawn_interval and len(self.enemies) < self.max_enemies:
            self._spawn_enemy()
            self.spawn_timer = 0
            
    def _spawn_enemy(self) -> None:
        """Spawn a new enemy"""
        # Choose random enemy type
        enemy_type = random.choice(list(EnemyType))
        
        # Choose random position (avoid center where player starts)
        x = random.randint(50, self.screen_width - 50)
        y = random.randint(50, self.screen_height - 50)
        
        # Avoid spawning too close to player
        if abs(x - self.screen_width // 2) < 100 and abs(y - self.screen_height // 2) < 100:
            x = random.choice([50, self.screen_width - 50])
            y = random.choice([50, self.screen_height - 50])
            
        enemy = Enemy(x, y, enemy_type)
        self.enemies.append(enemy)
        
    def get_enemies(self) -> List[Enemy]:
        """Get list of active enemies"""
        return self.enemies
        
    def clear_enemies(self) -> None:
        """Clear all enemies"""
        self.enemies.clear()
        
    def draw(self, screen: pygame.Surface) -> None:
        """Draw all enemies"""
        for enemy in self.enemies:
            enemy.draw(screen)
            
    def set_spawn_interval(self, interval: float) -> None:
        """Set the spawn interval"""
        self.spawn_interval = interval
        
    def set_max_enemies(self, max_count: int) -> None:
        """Set the maximum number of enemies"""
        self.max_enemies = max_count

