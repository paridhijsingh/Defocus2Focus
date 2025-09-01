"""
Game settings and constants for Defocus2Focus.
"""

# Display settings
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
FPS = 60
TITLE = "Defocus2Focus - Focus Management Game"

# Color definitions
# Background colors for different levels
BACKGROUND_COLORS = {
    "tutorial": (50, 50, 100),      # Dark blue
    "maze": (30, 60, 30),           # Dark green
    "platforms": (60, 30, 60),      # Dark purple
    "gauntlet": (80, 40, 20),       # Dark brown
    "challenge": (40, 40, 80),      # Dark blue-gray
    "speedrun": (80, 40, 40),       # Dark red
    "master": (20, 20, 20),         # Very dark gray
    "endless": (25, 25, 25)         # Dark gray
}

# Player colors
PLAYER_COLORS = {
    "focused": (0, 255, 0),         # Green
    "defocused": (255, 165, 0),     # Orange
    "transitioning": (128, 200, 64) # Light green
}

# Enemy colors by type
ENEMY_COLORS = {
    "distraction": (255, 255, 0),   # Yellow
    "interruption": (255, 0, 255),  # Magenta
    "time_pressure": (255, 0, 0)    # Red
}

# Obstacle colors by type
OBSTACLE_COLORS = {
    "wall": (139, 69, 19),          # Brown
    "pit": (0, 0, 0),               # Black
    "moving_platform": (70, 130, 180) # Steel blue
}

# UI colors
UI_COLORS = {
    "text": (255, 255, 255),        # White
    "text_shadow": (0, 0, 0),       # Black
    "button": (100, 100, 100),      # Gray
    "button_hover": (150, 150, 150), # Light gray
    "health_bar_bg": (50, 50, 50),  # Dark gray
    "health_bar_good": (0, 255, 0), # Green
    "health_bar_warning": (255, 255, 0), # Yellow
    "health_bar_danger": (255, 0, 0) # Red
}

# Game mechanics constants
# Player speeds
PLAYER_SPEEDS = {
    "normal": 5,
    "focused": 3,      # Slower when focused
    "defocused": 7     # Faster when defocused
}

# Focus power values
FOCUS_POWER = {
    "max": 100.0,
    "drain_rate": 2.0,     # Per second when focused
    "regen_rate": 1.0,     # Per second when defocused
    "transition_time": 0.5  # Seconds to switch states
}

# Enemy settings
ENEMY_SETTINGS = {
    "speed": 2,
    "spawn_interval": 5.0,  # Seconds between spawns
    "max_count": 10,
    "health": 100
}

# Collision distances and thresholds
COLLISION = {
    "player_size": 32,
    "enemy_size": 24,
    "min_spawn_distance": 100,  # Minimum distance from player for enemy spawns
    "interaction_range": 50      # Range for player-enemy interactions
}

# Level settings
LEVEL_SETTINGS = {
    "tutorial": {"time_limit": 60, "max_enemies": 3, "spawn_interval": 8.0},
    "maze": {"time_limit": 120, "max_enemies": 5, "spawn_interval": 6.0},
    "platforms": {"time_limit": 90, "max_enemies": 4, "spawn_interval": 7.0},
    "gauntlet": {"time_limit": 180, "max_enemies": 8, "spawn_interval": 4.0},
    "challenge": {"time_limit": 150, "max_enemies": 6, "spawn_interval": 5.0},
    "speedrun": {"time_limit": 60, "max_enemies": 7, "spawn_interval": 3.0},
    "master": {"time_limit": 300, "max_enemies": 12, "spawn_interval": 2.0},
    "endless": {"time_limit": None, "max_enemies": 15, "spawn_interval": 1.5}
}

# Difficulty multipliers (increase with level)
DIFFICULTY_MULTIPLIERS = {
    "enemy_speed": 1.2,      # 20% faster per level
    "spawn_rate": 0.9,       # 10% faster spawning per level
    "focus_drain": 1.1,      # 10% more focus drain per level
    "obstacle_count": 1.3    # 30% more obstacles per level
}

# Audio settings
AUDIO = {
    "master_volume": 0.7,
    "music_volume": 0.5,
    "sfx_volume": 0.8
}

# File paths
PATHS = {
    "assets": "assets/",
    "saves": "saves/",
    "config": "config/"
}

# Game window settings
WINDOW = {
    "width": WINDOW_WIDTH,
    "height": WINDOW_HEIGHT,
    "fps": FPS,
    "title": TITLE,
    "icon": "assets/icon.png" if PATHS["assets"] else None
}
