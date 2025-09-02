# 🌐 Web App

The Defocus2Focus web application provides a fully functional, browser-based version of the productivity app with all core features accessible through a modern, responsive interface.

## 📁 Files Overview

```
public/
├── index.html              # Main web application interface
├── build-index.html        # Production build (Netlify deployment)
├── access-instructions.html # App access instructions
├── expo-qr.html           # Expo QR code display
├── qr-code.html           # QR code generator
├── test.html              # Testing interface
└── README.md              # This documentation
```

## 🚀 Getting Started

### Local Development

1. **Serve the web app locally:**

   ```bash
   # From project root
   python3 -m http.server 5000
   # Or use any local server
   ```

2. **Access the app:**
   - Open `http://localhost:5000/public/index.html` in your browser
   - Or use the production build at `http://localhost:5000/public/build-index.html`

### Production Deployment

The web app is automatically deployed to Netlify when changes are pushed to the main branch.

## 🎯 Core Features

### 🎯 Focus Sessions

- **Pomodoro Timer**: 25-minute focus sessions with visual progress
- **Session Cycle**: Defocus → Focus → Unlock workflow
- **Progress Tracking**: Real-time session statistics
- **Energy Points**: Earn points for starting focus sessions

### ☕ Break Management

- **Break Types**: Micro (2min), Short (5min), Long (15min)
- **Break Activities**: Guided breathing, stretching, walking, meditation
- **Break Timer**: Visual countdown with progress bar
- **Break Statistics**: Track completion rates and streaks

### 🎵 Music & Relaxation

- **4 Audio Categories**: Nature, Ambient, Focus, Relax
- **24 Audio Files**: High-quality, offline-capable sounds
- **Background Playback**: Music continues when switching features
- **Mini Player**: Floating controls for seamless music management
- **Volume Control**: Persistent volume settings

### 📝 Task Management

- **To-Do Lists**: Create, edit, delete, and organize tasks
- **Categories**: Work, Study, Personal, Health, Shopping
- **Priorities**: High, Medium, Low with color coding
- **Due Dates**: Set and track task deadlines
- **Progress Tracking**: Daily completion statistics

### 🏆 Rewards System

- **Energy Points**: Earn points for every interaction
- **Badge System**: 6 unlockable badges (Bronze to Legendary)
- **Daily Goals**: Track daily energy point targets
- **Real-time Notifications**: Instant feedback for achievements
- **Progress Tracking**: Visual progress bars and statistics

## 🛠️ Technical Implementation

### Architecture

- **Pure HTML/CSS/JavaScript**: No frameworks, lightweight and fast
- **Local Storage**: Persistent data across browser sessions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline-First**: All features work without internet connection

### Key Technologies

- **HTML5**: Semantic markup and audio elements
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript ES6+**: Modern JavaScript features
- **Web Audio API**: Advanced audio processing and visualization
- **Local Storage API**: Data persistence

### File Structure

```
public/index.html
├── <head>
│   ├── Meta tags and title
│   ├── Audio manager script
│   └── CSS styles (embedded)
├── <body>
│   ├── Main app container
│   ├── Feature modals (music, todo, breaks, rewards)
│   └── JavaScript functionality (embedded)
```

## 🎨 User Interface

### Design Principles

- **Minimalist**: Clean, uncluttered interface
- **Calming**: Soft colors and gentle animations
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Keyboard navigation and screen reader support

### Color Scheme

- **Primary**: Soft blues and greens for calm
- **Accent**: Golden yellows for energy points
- **Background**: Light grays and whites
- **Text**: Dark grays for readability

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Adding New Features

1. **HTML Structure**: Add new elements to the main container
2. **CSS Styling**: Add styles to the embedded `<style>` block
3. **JavaScript Logic**: Add functions to the embedded `<script>` block
4. **Local Storage**: Update data persistence functions

### Modifying Existing Features

1. **Find the relevant section** in the HTML structure
2. **Update the CSS** for styling changes
3. **Modify JavaScript functions** for behavior changes
4. **Test across browsers** for compatibility

### Performance Optimization

- **Minify CSS/JS**: Remove unnecessary whitespace
- **Optimize Images**: Compress and resize images
- **Lazy Loading**: Load features on demand
- **Caching**: Use browser caching for static assets

## 🧪 Testing

### Manual Testing

1. **Feature Testing**: Test each feature individually
2. **Cross-browser Testing**: Test in Chrome, Firefox, Safari, Edge
3. **Responsive Testing**: Test on different screen sizes
4. **Performance Testing**: Check loading times and responsiveness

### Automated Testing

- **Unit Tests**: Test individual JavaScript functions
- **Integration Tests**: Test feature interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Monitor loading and response times

## 🚀 Deployment

### Netlify Deployment

The web app is automatically deployed to Netlify:

1. **Automatic Deployment**: Pushes to main branch trigger deployment
2. **Build Process**: `build-index.html` is served as the main file
3. **Custom Domain**: Configured for production use
4. **HTTPS**: Automatic SSL certificate

### Manual Deployment

1. **Build the app**: Copy `index.html` to `build-index.html`
2. **Upload to server**: Use FTP, SCP, or web interface
3. **Configure server**: Set up proper MIME types
4. **Test deployment**: Verify all features work

## 🔍 Troubleshooting

### Common Issues

**Audio not playing:**

- Check browser autoplay policies
- Verify audio files exist and are accessible
- Check console for JavaScript errors

**Data not persisting:**

- Check if Local Storage is enabled
- Verify browser supports Local Storage
- Check for storage quota limits

**Styling issues:**

- Check CSS syntax and browser compatibility
- Verify responsive breakpoints
- Test on different screen sizes

**Performance issues:**

- Check for memory leaks in JavaScript
- Optimize large audio files
- Minimize DOM manipulations

### Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Limited support (not recommended)

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [Audio System](../assets/audio/README.md) - Audio implementation
- [Components Documentation](../src/components/README.md) - UI components
- [Screens Documentation](../src/screens/README.md) - App screens

## 🚀 Future Enhancements

### Planned Features

- **PWA Support**: Progressive Web App capabilities
- **Offline Sync**: Sync data when connection is restored
- **Advanced Analytics**: Detailed usage statistics
- **Custom Themes**: User-selectable color schemes
- **Keyboard Shortcuts**: Power user features

### Technical Improvements

- **Service Workers**: Better offline functionality
- **Web Components**: Modular component architecture
- **TypeScript**: Type safety and better development experience
- **Build System**: Automated build and deployment pipeline

---

**Need help with the web app?** Check the [troubleshooting section](#-troubleshooting) or create an issue in the repository.
