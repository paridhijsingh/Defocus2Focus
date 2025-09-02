#!/usr/bin/env python3
"""
Script to create sample audio files for the Defocus2Focus app
This creates simple tone-based audio files for demonstration
"""

import numpy as np
import wave
import os

def create_tone(frequency, duration, sample_rate=44100, volume=0.3):
    """Create a simple tone"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    wave_data = volume * np.sin(2 * np.pi * frequency * t)
    return (wave_data * 32767).astype(np.int16)

def create_rain_sound(duration=3):
    """Create rain-like sound using multiple frequencies"""
    sample_rate = 22050  # Lower sample rate for smaller files
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Multiple frequencies for rain effect
    frequencies = [200, 300, 150, 250, 180, 220]
    wave_data = np.zeros(int(sample_rate * duration))
    
    for freq in frequencies:
        wave_data += 0.1 * np.sin(2 * np.pi * freq * t)
        # Add some randomness
        wave_data += 0.05 * np.sin(2 * np.pi * (freq + np.random.normal(0, 10)) * t)
    
    return (wave_data * 32767).astype(np.int16)

def create_ocean_sound(duration=3):
    """Create ocean-like sound"""
    sample_rate = 22050  # Lower sample rate for smaller files
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Ocean wave frequencies
    wave_data = 0.2 * np.sin(2 * np.pi * 100 * t)
    wave_data += 0.15 * np.sin(2 * np.pi * 150 * t)
    wave_data += 0.1 * np.sin(2 * np.pi * 200 * t)
    
    # Add wave-like modulation
    modulation = 0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t)
    wave_data *= modulation
    
    return (wave_data * 32767).astype(np.int16)

def create_meditation_sound(duration=3):
    """Create meditation-like sound"""
    sample_rate = 22050  # Lower sample rate for smaller files
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Calm frequencies
    wave_data = 0.2 * np.sin(2 * np.pi * 220 * t)
    wave_data += 0.15 * np.sin(2 * np.pi * 330 * t)
    wave_data += 0.1 * np.sin(2 * np.pi * 440 * t)
    
    return (wave_data * 32767).astype(np.int16)

def save_wav(filename, wave_data, sample_rate=22050):
    """Save wave data to WAV file"""
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(wave_data.tobytes())

def main():
    """Create sample audio files"""
    # Ensure directory exists
    os.makedirs('assets/audio', exist_ok=True)
    
    # Create sample audio files (3 seconds each for faster loading)
    audio_files = {
        'rain.wav': lambda: create_rain_sound(3),
        'ocean.wav': lambda: create_ocean_sound(3),
        'meditation.wav': lambda: create_meditation_sound(3),
        'forest.wav': lambda: create_tone(400, 3),
        'thunder.wav': lambda: create_tone(80, 3),
        'birds.wav': lambda: create_tone(800, 3),
        'wind.wav': lambda: create_tone(120, 3),
        'space.wav': lambda: create_tone(50, 3),
        'city.wav': lambda: create_tone(400, 3),
        'cafe.wav': lambda: create_tone(300, 3),
        'library.wav': lambda: create_tone(180, 3),
        'fireplace.wav': lambda: create_tone(120, 3),
        'train.wav': lambda: create_tone(200, 3),
        'binaural.wav': lambda: create_tone(440, 3),
        'classical.wav': lambda: create_tone(523, 3),
        'lofi.wav': lambda: create_tone(330, 3),
        'piano.wav': lambda: create_tone(440, 3),
        'white-noise.wav': lambda: create_tone(1000, 3),
        'brown-noise.wav': lambda: create_tone(500, 3),
        'spa.wav': lambda: create_tone(200, 3),
        'zen.wav': lambda: create_tone(110, 3),
        'chimes.wav': lambda: create_tone(660, 3),
        'singing-bowls.wav': lambda: create_tone(220, 3),
        'flute.wav': lambda: create_tone(440, 3),
    }
    
    print("Creating sample audio files...")
    
    for filename, generator in audio_files.items():
        filepath = f'assets/audio/{filename}'
        print(f"Creating {filepath}...")
        wave_data = generator()
        save_wav(filepath, wave_data)
    
    print("✅ Sample audio files created successfully!")
    print("\nNote: These are simple tone-based files for demonstration.")
    print("For production use, replace with high-quality audio files from:")
    print("- Freesound.org")
    print("- Zapsplat.com")
    print("- BBC Sound Effects")
    print("- YouTube Audio Library")

if __name__ == "__main__":
    main()
