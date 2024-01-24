// src/components/TopMenu.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { useTheme } from '../context/ThemeContext';

const TopMenu = ({ currentScreen, navigateToScreen }) => {
    const dynamicStyles = useDynamicStyles();
    const { theme } = useTheme();

    const screens = [
        { name: 'Bot', icon: 'robot', type: 'FontAwesome5' },
        { name: 'Threads', icon: 'comments', type: 'FontAwesome' },
        { name: 'Health', icon: 'heart', type: 'FontAwesome' },
        { name: 'Training', icon: 'weight-lifter', type: 'MaterialCommunityIcons' },
        { name: 'Nutrition', icon: 'food-steak', type: 'MaterialCommunityIcons' },
        { name: 'Profile', icon: 'user', type: 'FontAwesome' },
    ];

    const adjustedCurrentScreen = currentScreen - 1;

    const renderIcon = (icon, type, size, isSelected) => {
        const unselectedColor = theme === 'dark' ? "#A9A9A9" : "#696969";
        const color = isSelected ? (theme === 'dark' ? "#FFF" : "#05445E") : unselectedColor;
        switch (type) {
            case 'FontAwesome':
                return <FontAwesome name={icon} size={size} color={color} />;
            case 'FontAwesome5':
                return <FontAwesome5 name={icon} size={size} color={color} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon} size={size} color={color} />;
            default:
                return <FontAwesome name={icon} size={size} color={color} />;
        }
    };

    // Function to determine if a screen should be displayed in the top menu
    const shouldDisplay = index => {
        return index >= adjustedCurrentScreen - 2 && index <= currentScreen + 1;
    };

    const unselectedColor = theme === 'dark' ? "#A9A9A9" : "#696969";

    return (
        <View style={dynamicStyles.topMenu}>
            {adjustedCurrentScreen > 2 && (
                <AntDesign name="caretleft" size={10} color={unselectedColor} style={{ marginRight: 1 }} />
            )}
            {screens.map((screen, index) => shouldDisplay(index) && (
                <TouchableOpacity
                    key={index}
                    onPress={() => navigateToScreen(index + 1)}
                    style={{ alignItems: 'center', marginHorizontal: 3 }}
                >
                    {renderIcon(screen.icon, screen.type, adjustedCurrentScreen === index ? 24 : (Math.abs(adjustedCurrentScreen - index) === 1 ? 20 : 12), adjustedCurrentScreen === index)}
                    {adjustedCurrentScreen === index && (
                        <Text style={dynamicStyles.topMenuText}>
                            {screen.name}
                        </Text>
                    )}
                </TouchableOpacity>
            ))}
                {adjustedCurrentScreen < screens.length - 3 && (
                    <AntDesign name="caretright" size={10} color={unselectedColor} style={{ marginLeft: 1 }} />
                )}
        </View>
      );
};

export default TopMenu;
