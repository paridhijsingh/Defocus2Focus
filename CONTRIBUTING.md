# Contributing to Defocus2Focus 🎯

Thank you for your interest in contributing to Defocus2Focus! We welcome contributions from the community and appreciate your help in making this productivity app even better.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Check existing issues** - Make sure the issue hasn't already been reported
2. **Create a new issue** - Use the appropriate issue template
3. **Provide details** - Include steps to reproduce, expected behavior, and your environment

### Suggesting Features

We love new ideas! When suggesting features:

1. **Check existing feature requests** - Avoid duplicates
2. **Describe the use case** - Explain how it would help users
3. **Consider implementation** - Think about how it might work
4. **Be specific** - Detailed descriptions help us understand your vision

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git

### Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/Defocus2Focus.git
   cd Defocus2Focus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Guidelines

### Code Style

- Use **ESLint** and **Prettier** for consistent formatting
- Follow **React Native** best practices
- Use **functional components** with hooks
- Write **descriptive variable names**
- Add **comments** for complex logic

### File Structure

- Place components in `src/components/`
- Add screens to `src/screens/`
- Use contexts for state management in `src/contexts/`
- Add utilities to `src/utils/`
- Services go in `src/services/`

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add dark mode toggle to settings screen"
git commit -m "Fix audio playback issue on iOS"
git commit -m "Update README with new installation steps"

# Avoid
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "changes"
```

## 🧪 Testing

### Before Submitting

- [ ] Test on **iOS** (if possible)
- [ ] Test on **Android** (if possible)
- [ ] Test on **Web** browser
- [ ] Check for **console errors**
- [ ] Verify **audio functionality**
- [ ] Test **timer accuracy**
- [ ] Check **responsive design**

### Test Checklist

- [ ] New features work as expected
- [ ] No breaking changes to existing features
- [ ] Audio continues playing when switching screens
- [ ] Timer persists through app backgrounding
- [ ] Data saves correctly to local storage
- [ ] UI is responsive on different screen sizes

## 🎵 Audio Guidelines

When adding new audio files:

1. **Use royalty-free sources** - Ensure proper licensing
2. **Optimize file size** - Compress without quality loss
3. **Test playback** - Verify audio works on all platforms
4. **Add to appropriate category** - Nature, Ambient, Focus, or Relax
5. **Update documentation** - Add to audio README if needed

## 📱 Platform Considerations

### Cross-Platform Development

- **React Native** - Use platform-agnostic code when possible
- **Platform-specific code** - Use `.ios.js` or `.android.js` extensions
- **Web compatibility** - Ensure features work in browsers
- **Responsive design** - Test on various screen sizes

### Audio System

- **Web**: Uses HTML5 Audio API
- **Mobile**: Uses Expo Audio API
- **Background playback**: Test thoroughly on both platforms

## 🔄 Pull Request Process

### Before Submitting

1. **Update documentation** - Add/update relevant README files
2. **Test thoroughly** - Follow the testing checklist above
3. **Clean up code** - Remove debug logs and unused imports
4. **Update version** - If needed, update package.json version

### PR Description

Include:

- **What** - Brief description of changes
- **Why** - Reason for the change
- **How** - Implementation details
- **Testing** - How you tested the changes
- **Screenshots** - If UI changes were made

### Review Process

1. **Automated checks** - CI/CD pipeline will run
2. **Code review** - Maintainers will review your code
3. **Testing** - Changes will be tested on multiple platforms
4. **Feedback** - Address any requested changes
5. **Merge** - Once approved, your PR will be merged!

## 🏷️ Issue Labels

We use labels to categorize issues:

- **bug** - Something isn't working
- **enhancement** - New feature or request
- **documentation** - Improvements to documentation
- **good first issue** - Good for newcomers
- **help wanted** - Extra attention is needed
- **question** - Further information is requested

## 🎯 Areas for Contribution

### High Priority

- **Bug fixes** - Any issues reported by users
- **Performance improvements** - Optimize app speed and memory usage
- **Accessibility** - Improve screen reader support
- **Testing** - Add unit tests and integration tests

### Medium Priority

- **New audio categories** - Additional sound collections
- **UI/UX improvements** - Better user experience
- **Documentation** - Improve guides and README files
- **Platform support** - Better cross-platform compatibility

### Low Priority

- **New features** - Additional functionality
- **Themes** - Dark mode, color schemes
- **Localization** - Multi-language support
- **Analytics** - Usage tracking and insights

## 📞 Getting Help

### Community

- **GitHub Discussions** - Ask questions and share ideas
- **Issues** - Report bugs and request features
- **Pull Requests** - Contribute code and improvements

### Contact

- **Email** - your-email@example.com
- **GitHub** - Create an issue or discussion
- **Discord** - Join our community server (if available)

## 🏆 Recognition

Contributors will be:

- **Listed** in the README acknowledgments
- **Mentioned** in release notes for significant contributions
- **Invited** to join the core team for consistent contributors

## 📄 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance
- Race, religion, sexual orientation

### Expected Behavior

- **Be respectful** - Treat everyone with dignity
- **Be constructive** - Provide helpful feedback
- **Be collaborative** - Work together toward common goals
- **Be patient** - Remember that everyone is learning

### Unacceptable Behavior

- Harassment, trolling, or discrimination
- Personal attacks or inappropriate language
- Spam or off-topic discussions
- Any behavior that makes others feel unwelcome

## 📋 Checklist for Contributors

Before submitting your contribution:

- [ ] I have read and understood the contributing guidelines
- [ ] I have tested my changes on multiple platforms
- [ ] I have updated relevant documentation
- [ ] I have followed the code style guidelines
- [ ] I have written clear commit messages
- [ ] I have checked for any breaking changes
- [ ] I am ready to address feedback and make revisions

---

**Thank you for contributing to Defocus2Focus! Together, we're making productivity fun and accessible for everyone.** 🎯✨
