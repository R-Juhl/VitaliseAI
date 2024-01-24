// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import useAppSettings from '../store/useAppSettings';
import { translate } from '../components/translate';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

const ProfileScreen = () => {
  const { language } = useAppSettings();
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.titleText}>{translate('profileTitle', language)}</Text>
      <Text style={dynamicStyles.titleText}>Coming soon</Text>
    </View>
  );
};

export default ProfileScreen;
