// src/screens/NutritionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Nutrition</Text>
      <Text style={styles.titleText}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2F38',
  },
  titleText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default NutritionScreen;