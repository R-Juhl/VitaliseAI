// src/screens/HealthScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Health</Text>
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

export default HealthScreen;
