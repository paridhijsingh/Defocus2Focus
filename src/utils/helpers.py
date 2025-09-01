"""
Helper functions and utility tools for Defocus2Focus game.
"""

import pygame
import random
import math
import json
from typing import Tuple, List, Dict, Optional
from utils.settings import UI_COLORS, COLLISION


# ============================================================================
# Collision Detection Functions
# ============================================================================

def check_collision(rect1: pygame.Rect, rect2: pygame.Rect) -> bool:
    """Check if two rectangles are colliding"""
    return rect1.colliderect(rect2)

def check_circle_collision(pos1: Tuple[int, int], pos2: Tuple[int, int], radius: float) -> bool:
    """Check if two circles are colliding"""
    distance = math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)
    return distance < radius

def check_point_in_rect(point: Tuple[int, int], rect: pygame.Rect) -> bool:
    """Check if a point is inside a rectangle"""
    return rect.collidepoint(point)

def get_collision_direction(rect1: pygame.Rect, rect2: pygame.Rect) -> str:
    """Get the direction of collision between two rectangles"""
    # Calculate centers
    center1 = rect1.center
    center2 = rect2.center
    
    # Calculate differences
    dx = center2[0] - center1[0]
    dy = center2[1] - center1[1]
    
    # Determine primary collision direction
    if abs(dx) > abs(dy):
        return "left" if dx < 0 else "right"
    else:
        return "top" if dy < 0 else "bottom"


# ============================================================================
# Random Generation Utilities
# ============================================================================

def random_position(screen_width: int, screen_height: int, margin: int = 50) -> Tuple[int, int]:
    """Generate a random position within screen bounds with margin"""
    x = random.randint(margin, screen_width - margin)
    y = random.randint(margin, screen_height - margin)
    return (x, y)

def random_enemy_type() -> str:
    """Generate a random enemy type with weighted probabilities"""
    enemy_types = ["distraction", "interruption", "time_pressure"]
    weights = [0.4, 0.3, 0.3]  # 40% distraction, 30% interruption, 30% time_pressure
    return random.choices(enemy_types, weights=weights)[0]

def random_obstacle_layout(level_number: int, screen_width: int, screen_height: int) -> List[Dict]:
    """Generate a random obstacle layout for a level"""
    obstacles = []
    num_obstacles = 3 + level_number * 2
    
    for i in range(num_obstacles):
        x = random.randint(100, screen_width - 200)
        y = random.randint(100, screen_height - 200)
        width = random.randint(60, 150)
        height = random.randint(20, 40)
        
        obstacle_type = random.choice(["wall", "moving_platform"])
        obstacles.append({
            "x": x, "y": y, "width": width, "height": height,
            "type": obstacle_type
        })
    
    return obstacles

def random_color_variation(base_color: Tuple[int, int, int], variation: int = 30) -> Tuple[int, int, int]:
    """Generate a random color variation of a base color"""
    r = max(0, min(255, base_color[0] + random.randint(-variation, variation)))
    g = max(0, min(255, base_color[1] + random.randint(-variation, variation)))
    b = max(0, min(255, base_color[2] + random.randint(-variation, variation)))
    return (r, g, b)


# ============================================================================
# Math Helper Functions
# ============================================================================

def distance_between_points(pos1: Tuple[int, int], pos2: Tuple[int, int]) -> float:
    """Calculate Euclidean distance between two points"""
    return math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)

def angle_between_points(pos1: Tuple[int, int], pos2: Tuple[int, int]) -> float:
    """Calculate angle between two points in radians"""
    dx = pos2[0] - pos1[0]
    dy = pos2[1] - pos1[1]
    return math.atan2(dy, dx)

def lerp(start: float, end: float, factor: float) -> float:
    """Linear interpolation between two values"""
    return start + (end - start) * factor

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a value between min and max"""
    return max(min_val, min(max_val, value))


# ============================================================================
# Drawing Utilities
# ============================================================================

def draw_text_with_shadow(surface: pygame.Surface, text: str, font: pygame.font.Font, 
                         color: Tuple[int, int, int], pos: Tuple[int, int], 
                         shadow_offset: int = 2) -> None:
    """Draw text with a shadow effect"""
    # Draw shadow
    shadow_surface = font.render(text, True, UI_COLORS["text_shadow"])
    shadow_rect = shadow_surface.get_rect(center=(pos[0] + shadow_offset, pos[1] + shadow_offset))
    surface.blit(shadow_surface, shadow_rect)
    
    # Draw main text
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect(center=pos)
    surface.blit(text_surface, text_rect)

def draw_rounded_rect(surface: pygame.Surface, rect: pygame.Rect, color: Tuple[int, int, int], 
                     radius: int = 5) -> None:
    """Draw a rounded rectangle"""
    # For simplicity, we'll draw a regular rectangle
    # In a full implementation, you might want to use pygame.draw.rect with rounded corners
    pygame.draw.rect(surface, color, rect, border_radius=radius)

def draw_health_bar(surface: pygame.Surface, rect: pygame.Rect, current: float, maximum: float, 
                   colors: Optional[Dict[str, Tuple[int, int, int]]] = None) -> None:
    """Draw a health bar with color coding"""
    if colors is None:
        colors = {
            "good": UI_COLORS["health_bar_good"],
            "warning": UI_COLORS["health_bar_warning"],
            "danger": UI_COLORS["health_bar_danger"],
            "background": UI_COLORS["health_bar_bg"]
        }
    
    # Draw background
    pygame.draw.rect(surface, colors["background"], rect)
    
    # Calculate health percentage
    health_percentage = current / maximum if maximum > 0 else 0
    health_width = int(rect.width * health_percentage)
    
    # Choose color based on health percentage
    if health_percentage > 0.6:
        health_color = colors["good"]
    elif health_percentage > 0.3:
        health_color = colors["warning"]
    else:
        health_color = colors["danger"]
    
    # Draw health bar
    if health_width > 0:
        health_rect = pygame.Rect(rect.x, rect.y, health_width, rect.height)
        pygame.draw.rect(surface, health_color, health_rect)

def draw_progress_bar(surface: pygame.Surface, rect: pygame.Rect, progress: float, 
                     colors: Optional[Dict[str, Tuple[int, int, int]]] = None) -> None:
    """Draw a progress bar"""
    if colors is None:
        colors = {
            "background": UI_COLORS["health_bar_bg"],
            "fill": UI_COLORS["health_bar_good"]
        }
    
    # Draw background
    pygame.draw.rect(surface, colors["background"], rect)
    
    # Draw progress
    progress_width = int(rect.width * progress)
    if progress_width > 0:
        progress_rect = pygame.Rect(rect.x, rect.y, progress_width, rect.height)
        pygame.draw.rect(surface, colors["fill"], progress_rect)


# ============================================================================
# File and Data Helpers
# ============================================================================

def load_json_file(filepath: str) -> Dict:
    """Load data from a JSON file"""
    try:
        with open(filepath, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading JSON file {filepath}: {e}")
        return {}

def save_json_file(filepath: str, data: Dict) -> bool:
    """Save data to a JSON file"""
    try:
        with open(filepath, 'w') as file:
            json.dump(data, file, indent=2)
        return True
    except Exception as e:
        print(f"Error saving JSON file {filepath}: {e}")
        return False

def load_image(filepath: str, scale: Optional[float] = None) -> Optional[pygame.Surface]:
    """Load an image with optional scaling"""
    try:
        image = pygame.image.load(filepath).convert_alpha()
        if scale and scale != 1.0:
            new_size = (int(image.get_width() * scale), int(image.get_height() * scale))
            image = pygame.transform.scale(image, new_size)
        return image
    except pygame.error as e:
        print(f"Error loading image {filepath}: {e}")
        return None

def load_sound(filepath: str, volume: float = 1.0) -> Optional[pygame.mixer.Sound]:
    """Load a sound file with volume control"""
    try:
        sound = pygame.mixer.Sound(filepath)
        sound.set_volume(volume)
        return sound
    except pygame.error as e:
        print(f"Error loading sound {filepath}: {e}")
        return None


# ============================================================================
# Game State Utilities
# ============================================================================

def format_time(seconds: float) -> str:
    """Format time in MM:SS format"""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"

def format_score(score: int) -> str:
    """Format score with comma separators"""
    return f"{score:,}"

def calculate_level_progress(completed: int, total: int) -> float:
    """Calculate progress percentage"""
    return (completed / total * 100) if total > 0 else 0

def validate_save_data(data: Dict) -> bool:
    """Validate save data structure"""
    required_keys = ["current_level", "unlocked_levels", "level_completions"]
    return all(key in data for key in required_keys)


# ============================================================================
# Debug Utilities
# ============================================================================

def debug_draw_collision_boxes(surface: pygame.Surface, objects: List) -> None:
    """Draw collision boxes for debugging"""
    for obj in objects:
        if hasattr(obj, 'get_rect'):
            rect = obj.get_rect()
            pygame.draw.rect(surface, (255, 0, 0), rect, 2)  # Red outline

def debug_print_game_state(game_state: str) -> None:
    """Print game state information for debugging"""
    print(f"[DEBUG] Game State: {game_state}")

def debug_fps_counter(surface: pygame.Surface, fps: float) -> None:
    """Display FPS counter for debugging"""
    font = pygame.font.Font(None, 24)
    fps_text = font.render(f"FPS: {fps:.1f}", True, UI_COLORS["text"])
    surface.blit(fps_text, (10, 10))
