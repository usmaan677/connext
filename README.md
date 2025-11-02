# UH Clubs App 🎓

A cross-platform mobile application for University of Houston clubs built with Expo and React Native. This app allows students to discover and explore university clubs with a modern, intuitive interface.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (optional but recommended)
- **Git** - [Download here](https://git-scm.com/)

For mobile development:
- **iOS**: Xcode (macOS only) or Expo Go app
- **Android**: Android Studio or Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uh-clubs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Web Browser**: Press `w` in the terminal or run `npm run web`
   - **Physical Device**: Scan the QR code with Expo Go app

## 📱 Platform Support

This app supports:
- ✅ iOS (iPhone & iPad)
- ✅ Android
- ✅ Web browsers
- ✅ Both light and dark themes

## 🛠 Development Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality
- `npm run reset-project` - Reset to blank project template

## 📁 Project Structure

```
uh-clubs/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home/main screen
│   │   └── explore.tsx    # Explore clubs screen
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── assets/                # Static assets (images, icons)
├── components/            # Reusable React components
│   └── ui/               # UI component library
├── constants/             # App constants and themes
├── hooks/                 # Custom React hooks
└── connext/              # Additional app modules
```

## 🎨 Features

- **Tab Navigation**: Easy navigation between main app sections
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Cross-Platform**: Runs on iOS, Android, and web
- **Modern UI**: Built with Expo's latest components and design patterns
- **TypeScript**: Full type safety and better development experience

## 🔧 Technology Stack

- **Framework**: Expo SDK ~54.0
- **Language**: TypeScript
- **UI Library**: React Native with Expo components
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **Development**: ESLint for code quality

## 📦 Key Dependencies

- **Expo Router**: File-based navigation system
- **React Navigation**: Tab and stack navigation
- **Expo Vector Icons**: Icon library
- **React Native Reanimated**: Smooth animations
- **Expo Haptics**: Tactile feedback

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android build issues**
   - Ensure Android Studio and SDK are properly installed
   - Check that ANDROID_HOME environment variable is set

### Getting Help

- **Expo Documentation**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **React Native Docs**: [https://reactnative.dev/](https://reactnative.dev/)
- **Expo Discord**: [https://chat.expo.dev](https://chat.expo.dev)

## 🎯 Getting Started with Development

1. **For new features**: Create a new screen in the `app/` directory
2. **For reusable components**: Add them to the `components/` directory
3. **For styling**: Use the theme constants in `constants/theme.ts`
4. **For navigation**: Expo Router uses file-based routing - just create files in `app/`

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy coding! 🚀**
