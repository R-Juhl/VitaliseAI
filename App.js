// App.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';

import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from './tamagui.config';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './src/hooks/useFonts';

import { ThemeProvider } from './src/context/ThemeContext';
import useAppSettings from './src/store/useAppSettings';

// Components
import Header from './src/components/Header';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import BotScreen from './src/screens/BotScreen';
import ThreadsScreen from './src/screens/ThreadsScreen';
import HealthScreen from './src/screens/HealthScreen';
import TrainingScreen from './src/screens/TrainingScreen';
import NutritionScreen from './src/screens/NutritionScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const { width } = Dimensions.get('window');
const screenComponents = [HomeScreen, BotScreen, ThreadsScreen, HealthScreen, TrainingScreen, NutritionScreen, ProfileScreen];

const App = () => {
  const { displaySetting } = useAppSettings();

  const [isReady, setIsReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeThreshold = 100;
  const [routeParams, setRouteParams] = useState({});


  const loadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    const initApp = async () => {
      await loadFonts();
      await SplashScreen.hideAsync();
      setIsReady(true);
    };
    initApp();
  }, []);

  const navigateToScreen = (screenIndex, params = {}) => {
    setCurrentScreen(screenIndex);
    setRouteParams(params);  // Store the params in the state
    Animated.timing(translateX, {
      toValue: -screenIndex * width,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let newScreen = currentScreen;
      const endX = event.nativeEvent.translationX;

      if (endX > swipeThreshold && currentScreen > 0) {
        newScreen = currentScreen - 1;
      } else if (endX < -swipeThreshold && currentScreen < screenComponents.length - 1) {
        newScreen = currentScreen + 1;
      }

      translateX.flattenOffset();
      navigateToScreen(newScreen);
    } else if (event.nativeEvent.oldState === State.BEGAN) {
      translateX.setOffset(-currentScreen * width);
      translateX.setValue(0);
    }
  };

  if (!isReady) {
    return null; // Return null to render nothing while loading
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider>
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: displaySetting === 'dark' ? '#1A2F38' : '#D3E0EA' }}>
            <Header
              currentScreen={currentScreen}
              navigateToScreen={navigateToScreen}
            />
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: width * screenComponents.length,
                  transform: [{ translateX }],
                }}
              >
                {screenComponents.map((ScreenComponent, index) => (
                  <View key={index} style={{ width, flex: 1 }}>
                    <ScreenComponent
                      isActive={index === currentScreen}
                      route={{ params: routeParams }}
                      navigateToScreen={navigateToScreen}
                      navigation={{ navigate: navigateToScreen }}
                    />
                  </View>
                ))}
              </Animated.View>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ThemeProvider>
    </TamaguiProvider>
  );
};

export default App;