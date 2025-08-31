# Defocus2Focus

**Where Procrastination Meets Play – Gamified Focus & Productivity App**

Defocus2Focus is a unique game that teaches focus management through interactive gameplay.  
Players must balance between focused and defocused states to overcome challenges and progress through levels.

## 🎮 Game Concept

Players master the balance between:

- **Focused State**: Slower movement, drains focus power, but gives strategic advantages
- **Defocused State**: Faster movement, regenerates focus power, but with limited abilities

The core mechanic is knowing when to focus and when to defocus to solve puzzles and overcome obstacles.

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/paridhijsingh/Defocus2Focus.git
   cd Defocus2Focus
   ```

2. Install Dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Run The Game

   ```bash
   python main.py
   ```

## 🎯 Game Controls

- **WASD** / **Arrow Keys** - Move player
- **F** - Toggle focus/defocus state
- **ESC** - Pause/Resume game
- **R** - Restart current level
- **Q** - Quit to main menu

## 🏗️ Project Structure

```
Defocus2Focus/
├── main.py
├── requirements.txt
├── src/
│   ├── game/
│   │   ├── __init__.py
│   │   ├── player.py
│   │   ├── enemy.py
│   │   ├── levels.py
│   │   └── game_loop.py
│   ├── ui/
│   │   ├── __init__.py
│   │   ├── hud.py
│   │   └── menu.py
│   └── utils/
│       ├── __init__.py
│       ├── settings.py
│       └── helpers.py
├── assets/
├── tests/
└── README.md
```

## 🎲 Game Features

### Core Mechanics

- **Dual-State System**: Switch between focused and defocused modes
- **Focus Power Management**: Balance resource consumption and regeneration
- **Strategic Movement**: Different speeds and abilities for each state

### Level Progression

1. **Tutorial** - Learn basic mechanics
2. **Maze Runner** - Navigation challenges
3. **Moving Platforms** - Timing-based obstacles
4. **Enemy Gauntlet** - Combat scenarios
5. **Focus Challenge** - Resource management
6. **Speed Run** - Time pressure challenges
7. **Master Level** - Ultimate challenge
8. **Endless Mode** - Survival challenge

### Enemy Types

- **Distraction Enemies** - Slow player movement
- **Interruption Enemies** - Force defocus state
- **Time Pressure Enemies** - Create urgency

## 🛠️ Development

### Setup Development Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running Tests

```bash
python -m pytest tests/
```

### Code Style

- Follow PEP 8 guidelines
- Use type hints where appropriate
- Add docstrings to all functions and classes

## 🎨 Customization

### Modify Game Settings

Edit `src/utils/settings.py` to adjust:

- Window dimensions & FPS
- Player speeds & focus power values
- Enemy spawn rates & behaviors
- Level time limits & difficulty

### Adding New Levels

1. Modify `src/game/levels.py`
2. Add new level configuration
3. Create custom obstacle layouts
4. Define level-specific objectives

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes & add tests
4. Submit a pull request

## 🙏 Acknowledgments

- Built with [Pygame](https://www.pygame.org/)
- Inspired by productivity & focus management techniques
- Community feedback and contributions

---

**Happy Gaming and Focus Building! 🎯✨**
