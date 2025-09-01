"""
Level management for Defocus2Focus game.
"""

import pygame
from typing import List, Tuple, Dict, Optional
from .enemy import Enemy, EnemyType, Obstacle, ObstacleType, EnemySpawner
from .player import Player
from utils.settings import BACKGROUND_COLORS, LEVEL_SETTINGS, DIFFICULTY_MULTIPLIERS
from utils.helpers import random_obstacle_layout


class Level:
    """Individual level with specific layout and objectives"""
    
    def __init__(self, level_number: int, name: str, description: str):
        self.level_number = level_number
        self.name = name
        self.description = description
        self.completed = False
        self.score = 0
        self.time_limit = None  # None means no time limit
        self.time_remaining = None
        
        # Level elements
        self.obstacles: List[Obstacle] = []
        self.enemy_spawner: Optional[EnemySpawner] = None
        self.player_start_pos: Tuple[int, int] = (400, 300)
        self.objectives: List[Dict] = []
        
        # Level-specific properties
        self.background_color = BACKGROUND_COLORS.get(name.lower().replace(" ", "_"), (50, 50, 100))
        self.difficulty_multiplier = 1.0 + (level_number - 1) * 0.2
        
    def setup(self, screen_width: int, screen_height: int) -> None:
        """Setup level-specific elements"""
        self._create_obstacles(screen_width, screen_height)
        self._create_enemy_spawner(screen_width, screen_height)
        self._create_objectives()
        
        if self.time_limit:
            self.time_remaining = self.time_limit
            
    def _create_obstacles(self, screen_width: int, screen_height: int) -> None:
        """Create level-specific obstacles"""
        if self.level_number == 1:
            # Tutorial level - simple walls
            self.obstacles = [
                Obstacle(200, 100, 400, 20, ObstacleType.WALL),
                Obstacle(200, 500, 400, 20, ObstacleType.WALL),
                Obstacle(100, 200, 20, 200, ObstacleType.WALL),
                Obstacle(700, 200, 20, 200, ObstacleType.WALL),
            ]
        elif self.level_number == 2:
            # Maze level
            self.obstacles = [
                Obstacle(150, 150, 100, 20, ObstacleType.WALL),
                Obstacle(350, 150, 100, 20, ObstacleType.WALL),
                Obstacle(550, 150, 100, 20, ObstacleType.WALL),
                Obstacle(150, 250, 20, 100, ObstacleType.WALL),
                Obstacle(350, 250, 20, 100, ObstacleType.WALL),
                Obstacle(550, 250, 20, 100, ObstacleType.WALL),
                Obstacle(150, 450, 100, 20, ObstacleType.WALL),
                Obstacle(350, 450, 100, 20, ObstacleType.WALL),
                Obstacle(550, 450, 100, 20, ObstacleType.WALL),
            ]
        elif self.level_number == 3:
            # Moving platforms level
            self.obstacles = [
                Obstacle(100, 200, 150, 20, ObstacleType.MOVING_PLATFORM),
                Obstacle(400, 300, 150, 20, ObstacleType.MOVING_PLATFORM),
                Obstacle(600, 400, 150, 20, ObstacleType.MOVING_PLATFORM),
                Obstacle(200, 500, 20, 100, ObstacleType.WALL),
                Obstacle(600, 100, 20, 100, ObstacleType.WALL),
            ]
        else:
            # Higher levels - more complex layouts
            self.obstacles = self._generate_complex_layout(screen_width, screen_height)
            
    def _generate_complex_layout(self, screen_width: int, screen_height: int) -> List[Obstacle]:
        """Generate complex obstacle layout for higher levels"""
        obstacles = []
        
        # Create random walls
        for i in range(5 + self.level_number * 2):
            x = (i * 150) % (screen_width - 100)
            y = (i * 120) % (screen_height - 100)
            width = 80 + (i % 3) * 40
            height = 20 + (i % 2) * 30
            
            obstacle_type = ObstacleType.WALL if i % 3 != 0 else ObstacleType.MOVING_PLATFORM
            obstacles.append(Obstacle(x, y, width, height, obstacle_type))
            
        # Add some pits
        for i in range(self.level_number):
            x = 100 + (i * 200) % (screen_width - 200)
            y = 150 + (i * 150) % (screen_height - 200)
            obstacles.append(Obstacle(x, y, 60, 60, ObstacleType.PIT))
            
        return obstacles
        
    def _create_enemy_spawner(self, screen_width: int, screen_height: int) -> None:
        """Create enemy spawner for the level"""
        self.enemy_spawner = EnemySpawner(screen_width, screen_height)
        
        # Get level-specific settings
        level_key = self._get_level_key()
        if level_key in LEVEL_SETTINGS:
            settings = LEVEL_SETTINGS[level_key]
            if self.enemy_spawner:
                self.enemy_spawner.spawn_interval = settings.get("spawn_interval", 5.0)
                self.enemy_spawner.max_enemies = settings.get("max_enemies", 5)
                
    def _get_level_key(self) -> str:
        """Get the key for level settings"""
        level_names = {
            1: "tutorial",
            2: "maze", 
            3: "platforms",
            4: "gauntlet",
            5: "challenge",
            6: "speedrun",
            7: "master",
            8: "endless"
        }
        return level_names.get(self.level_number, "tutorial")
            
    def _create_objectives(self) -> None:
        """Create level objectives"""
        if self.level_number == 1:
            self.objectives = [
                {"type": "reach_exit", "description": "Reach the exit point", "completed": False},
                {"type": "survive_time", "description": "Survive for 30 seconds", "completed": False, "time": 30}
            ]
        elif self.level_number == 2:
            self.objectives = [
                {"type": "collect_items", "description": "Collect 3 focus items", "completed": False, "required": 3, "current": 0},
                {"type": "avoid_enemies", "description": "Don't touch any enemies", "completed": False}
            ]
        else:
            self.objectives = [
                {"type": "reach_exit", "description": "Reach the exit point", "completed": False},
                {"type": "defeat_enemies", "description": f"Defeat {self.level_number * 2} enemies", "completed": False, "required": self.level_number * 2, "current": 0},
                {"type": "time_limit", "description": f"Complete within {60 - self.level_number * 10} seconds", "completed": False, "time": 60 - self.level_number * 10}
            ]
            
    def update(self, dt: float, player: Player) -> None:
        """Update level state"""
        # Update time limit
        if self.time_limit and self.time_remaining is not None:
            self.time_remaining -= dt
            if self.time_remaining <= 0:
                self._handle_time_out()
                
        # Update obstacles
        for obstacle in self.obstacles:
            obstacle.update(dt)
            
        # Update enemy spawner
        if self.enemy_spawner:
            self.enemy_spawner.update(dt, (player.x, player.y))
            
        # Check objectives
        self._check_objectives(player)
        
    def _handle_time_out(self) -> None:
        """Handle level time out"""
        self.time_remaining = 0
        # Could trigger game over or level restart
        
    def _check_objectives(self, player: Player) -> None:
        """Check if level objectives are completed"""
        for objective in self.objectives:
            if objective["completed"]:
                continue
                
            if objective["type"] == "reach_exit":
                # Check if player reached exit (simplified - could be more complex)
                if player.x > 750 and player.y > 550:
                    objective["completed"] = True
                    
            elif objective["type"] == "survive_time":
                if self.time_remaining and self.time_remaining <= 0:
                    objective["completed"] = True
                    
            elif objective["type"] == "collect_items":
                # This would be implemented with collectible items
                pass
                
            elif objective["type"] == "avoid_enemies":
                # Check if player touched any enemies
                if self.enemy_spawner:
                    for enemy in self.enemy_spawner.get_enemies():
                        if player.get_rect().colliderect(enemy.get_rect()):
                            objective["completed"] = False
                            break
                    else:
                        objective["completed"] = True
                        
        # Check if all objectives are completed
        if all(obj["completed"] for obj in self.objectives):
            self.completed = True
            
    def draw(self, screen: pygame.Surface) -> None:
        """Draw level elements"""
        # Draw background
        screen.fill(self.background_color)
        
        # Draw obstacles
        for obstacle in self.obstacles:
            obstacle.draw(screen)
            
        # Draw enemy spawner
        if self.enemy_spawner:
            self.enemy_spawner.draw(screen)
            
        # Draw level info
        self._draw_level_info(screen)
        
    def _draw_level_info(self, screen: pygame.Surface) -> None:
        """Draw level information on screen"""
        font = pygame.font.Font(None, 36)
        
        # Level title
        title_text = font.render(f"Level {self.level_number}: {self.name}", True, (255, 255, 255))
        screen.blit(title_text, (20, 20))
        
        # Time remaining
        if self.time_limit and self.time_remaining is not None:
            time_text = font.render(f"Time: {int(self.time_remaining)}s", True, (255, 255, 255))
            screen.blit(time_text, (20, 60))
            
        # Objectives
        font_small = pygame.font.Font(None, 24)
        y_offset = 100
        for i, objective in enumerate(self.objectives):
            color = (0, 255, 0) if objective["completed"] else (255, 255, 255)
            status = "✓" if objective["completed"] else "○"
            obj_text = font_small.render(f"{status} {objective['description']}", True, color)
            screen.blit(obj_text, (20, y_offset + i * 25))
            
    def get_obstacles(self) -> List[Obstacle]:
        """Get list of obstacles in the level"""
        return self.obstacles
        
    def get_enemies(self) -> List[Enemy]:
        """Get list of enemies in the level"""
        if self.enemy_spawner:
            return self.enemy_spawner.get_enemies()
        return []
        
    def reset(self) -> None:
        """Reset level to initial state"""
        self.completed = False
        self.score = 0
        if self.time_limit:
            self.time_remaining = self.time_limit
            
        # Reset objectives
        for objective in self.objectives:
            objective["completed"] = False
            if "current" in objective:
                objective["current"] = 0
                
        # Clear enemies
        if self.enemy_spawner:
            self.enemy_spawner.clear_enemies()


class LevelManager:
    """Manages progression through game levels"""
    
    def __init__(self):
        self.levels: List[Level] = []
        self.current_level_index = 0
        self.unlocked_levels = 1
        
        self._create_levels()
        
    def _create_levels(self) -> None:
        """Create all game levels"""
        level_data = [
            (1, "Tutorial", "Learn the basics of movement and focus"),
            (2, "Maze Runner", "Navigate through a complex maze"),
            (3, "Moving Platforms", "Master timing with moving platforms"),
            (4, "Enemy Gauntlet", "Face waves of enemies"),
            (5, "Focus Challenge", "Manage your focus power carefully"),
            (6, "Speed Run", "Complete objectives under time pressure"),
            (7, "Master Level", "The ultimate test of skill"),
            (8, "Endless Mode", "Survive as long as possible")
        ]
        
        for level_num, name, description in level_data:
            level = Level(level_num, name, description)
            
            # Set level-specific properties
            if level_num == 1:
                level.time_limit = 60  # 1 minute tutorial
            elif level_num == 2:
                level.time_limit = 120  # 2 minutes for maze
            elif level_num == 3:
                level.time_limit = 90   # 1.5 minutes for platforms
            elif level_num == 4:
                level.time_limit = 180  # 3 minutes for enemy gauntlet
            elif level_num == 5:
                level.time_limit = 150  # 2.5 minutes for focus challenge
            elif level_num == 6:
                level.time_limit = 60   # 1 minute speed run
            elif level_num == 7:
                level.time_limit = 300  # 5 minutes for master level
            elif level_num == 8:
                level.time_limit = None  # No time limit for endless mode
                
            self.levels.append(level)
            
    def get_current_level(self) -> Level:
        """Get the currently active level"""
        return self.levels[self.current_level_index]
        
    def next_level(self) -> bool:
        """Advance to the next level"""
        if self.current_level_index < len(self.levels) - 1:
            self.current_level_index += 1
            self.unlocked_levels = max(self.unlocked_levels, self.current_level_index + 1)
            return True
        return False
        
    def previous_level(self) -> bool:
        """Go back to the previous level"""
        if self.current_level_index > 0:
            self.current_level_index -= 1
            return True
        return False
        
    def go_to_level(self, level_number: int) -> bool:
        """Go to a specific level number"""
        if 1 <= level_number <= len(self.levels) and level_number <= self.unlocked_levels:
            self.current_level_index = level_number - 1
            return True
        return False
        
    def unlock_level(self, level_number: int) -> None:
        """Unlock a specific level"""
        if 1 <= level_number <= len(self.levels):
            self.unlocked_levels = max(self.unlocked_levels, level_number)
            
    def get_level_progress(self) -> Dict:
        """Get overall level progress"""
        completed_levels = sum(1 for level in self.levels if level.completed)
        total_levels = len(self.levels)
        
        return {
            "completed": completed_levels,
            "total": total_levels,
            "percentage": (completed_levels / total_levels) * 100 if total_levels > 0 else 0,
            "unlocked": self.unlocked_levels,
            "current": self.current_level_index + 1
        }
        
    def reset_progress(self) -> None:
        """Reset all level progress"""
        for level in self.levels:
            level.reset()
        self.current_level_index = 0
        
    def save_progress(self) -> Dict:
        """Save current progress for persistence"""
        return {
            "current_level": self.current_level_index + 1,
            "unlocked_levels": self.unlocked_levels,
            "level_completions": [level.completed for level in self.levels],
            "level_scores": [level.score for level in self.levels]
        }
        
    def load_progress(self, progress_data: Dict) -> None:
        """Load saved progress"""
        if "current_level" in progress_data:
            self.go_to_level(progress_data["current_level"])
            
        if "unlocked_levels" in progress_data:
            self.unlocked_levels = progress_data["unlocked_levels"]
            
        if "level_completions" in progress_data:
            for i, completed in enumerate(progress_data["level_completions"]):
                if i < len(self.levels):
                    self.levels[i].completed = completed
                    
        if "level_scores" in progress_data:
            for i, score in enumerate(progress_data["level_scores"]):
                if i < len(self.levels):
                    self.levels[i].score = score
