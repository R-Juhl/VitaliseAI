// src/components/TopMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const TopMenu = ({ currentScreen, navigateToScreen }) => {
    const screens = [
        { name: 'Bot', icon: 'robot', type: 'FontAwesome5' },
        { name: 'Threads', icon: 'comments', type: 'FontAwesome' },
        { name: 'Health', icon: 'heart', type: 'FontAwesome' },
        { name: 'Training', icon: 'weight-lifter', type: 'MaterialCommunityIcons' },
        { name: 'Nutrition', icon: 'food-steak', type: 'MaterialCommunityIcons' },
        { name: 'Profile', icon: 'user', type: 'FontAwesome' },
    ];

    const adjustedCurrentScreen = currentScreen - 1;

    const renderIcon = (icon, type, size, color) => {
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

    return (
        <View style={styles.topMenu}>
            {adjustedCurrentScreen > 2 && (
                <AntDesign name="caretleft" size={10} color="#A9A9A9" style={{ marginRight: 1 }} />
            )}
            {screens.map((screen, index) => shouldDisplay(index) && (
                <TouchableOpacity
                    key={index}
                    onPress={() => navigateToScreen(index + 1)}
                    style={{ alignItems: 'center', marginHorizontal: 3 }}
                >
                    {renderIcon(screen.icon, screen.type, adjustedCurrentScreen === index ? 24 : (Math.abs(adjustedCurrentScreen - index) === 1 ? 20 : 12), adjustedCurrentScreen === index ? "#FFF" : "#A9A9A9")}
                    {adjustedCurrentScreen === index && (
                        <Text style={{ color: "#FFF", fontSize: 14, marginTop: 3 }}>
                            {screen.name}
                        </Text>
                    )}
                </TouchableOpacity>
            ))}
                {adjustedCurrentScreen < screens.length - 3 && (
                    <AntDesign name="caretright" size={10} color="#A9A9A9" style={{ marginLeft: 1 }} />
                )}
        </View>
      );
};

const styles = StyleSheet.create({
    topMenu: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    }
});

export default TopMenu;
