"""
Helper functions and utility tools for Defocus2Focus game.

This file should contain:

1. Collision detection functions:
   - check_collision(rect1, rect2) - Basic rectangle collision
   - check_circle_collision(pos1, pos2, radius) - Circular collision
   - check_point_in_rect(point, rect) - Point containment
   - get_collision_direction(rect1, rect2) - Collision side detection

2. Random generation utilities:
   - random_position(screen_width, screen_height, margin) - Safe spawn positions
   - random_enemy_type() - Weighted random enemy selection
   - random_obstacle_layout(level_number) - Procedural obstacle generation
   - random_color_variation(base_color, variation) - Color randomization

3. Math helper functions:
   - distance_between_points(pos1, pos2) - Euclidean distance
   - angle_between_points(pos1, pos2) - Angle calculation
   - lerp(start, end, factor) - Linear interpolation
   - clamp(value, min_val, max_val) - Value clamping

4. Drawing utilities:
   - draw_text_with_shadow(surface, text, font, color, pos) - Text rendering
   - draw_rounded_rect(surface, rect, color, radius) - Rounded rectangles
   - draw_health_bar(surface, rect, current, maximum, colors) - Health bars
   - draw_progress_bar(surface, rect, progress, colors) - Progress indicators

5. File and data helpers:
   - load_json_file(filepath) - JSON file loading
   - save_json_file(filepath, data) - JSON file saving
   - load_image(filepath, scale=None) - Image loading with optional scaling
   - load_sound(filepath, volume=1.0) - Audio file loading

6. Game state utilities:
   - format_time(seconds) - Time formatting (MM:SS)
   - format_score(score) - Score formatting with commas
   - calculate_level_progress(completed, total) - Progress percentage
   - validate_save_data(data) - Save data validation

7. Debug utilities:
   - debug_draw_collision_boxes(surface, objects) - Visual collision debugging
   - debug_print_game_state(game_state) - State information logging
   - debug_fps_counter(surface, fps) - FPS display

These helper functions provide reusable tools for common game operations and improve code maintainability.
"""
