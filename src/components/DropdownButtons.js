// /src/components/AuthButtons.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AuthButtons = ({ onSignup, onLogin, onLogout, onSettings, user }) => {


    return (
        <View style={styles.dropdownContainer}>
            {user && (
                <View style={styles.userNameText}>
                    <Text style={styles.userNameText}>{user.name}</Text>
                </View>
            )}
            {!user ? (
                <>
                <TouchableOpacity onPress={onLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSignup} style={styles.button}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSettings} style={styles.button}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
                </>
            ) : (
            <>
                <TouchableOpacity onPress={onLogout} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSettings} style={styles.button}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
            </>
                
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'absolute',
        backgroundColor: '#05445E',
        right: -5,
        borderRadius: 10,
        padding: 5,
        paddingTop: 15,
        paddingRight: 15,
        zIndex: 1000,
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#189AB4',
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    userNameText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default AuthButtons;
