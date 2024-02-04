// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import useAppSettings from '../store/useAppSettings';
import { translate } from '../components/translate';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

const HomeScreen = () => {
  const { language } = useAppSettings();
  const dynamicStyles = useDynamicStyles();

  const logoSize = 400;

  return (
    <View style={dynamicStyles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/logo_dark.png')}
        style={{ alignSelf: 'center', width: logoSize, height: logoSize }}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={dynamicStyles.homeTitle}>{translate('homePlanTitle', language)}</Text>

      {/* Plan Container TEMPORARY PLACEHOLDER */}
      <View style={[dynamicStyles.homePlanItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={dynamicStyles.homePlanTitle}>Hike, 2 hours</Text>
          <Text style={dynamicStyles.homePlanDate}>2024-25-01</Text>
        </View>
        <TouchableOpacity style={dynamicStyles.homePlanButton}>
          <Text style={{ color: 'white' }}>Start</Text>
        </TouchableOpacity>
      </View>
      {/* Plan Container TEMPORARY PLACEHOLDER */}
      <View style={[dynamicStyles.homePlanItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={dynamicStyles.homePlanTitle}>Fitness, Leg-day</Text>
          <Text style={dynamicStyles.homePlanDate}>2024-25-01</Text>
        </View>
        <TouchableOpacity style={dynamicStyles.homePlanButton}>
          <Text style={{ color: 'white' }}>Start</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default HomeScreen;
