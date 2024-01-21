// /src/components/SignupModal.js
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';

const SignupModal = ({ isVisible, onCancel }) => {
    const [signUpError, setSignUpError] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    });

    const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

    const isPasswordComplex = (password) => {
        const hasMinLength = password.length >= 8;
        const hasCapitalLetter = /[A-Z]/.test(password);
        return hasMinLength && hasCapitalLetter;
    };

    const isFormValid = () => {
        // Check if all fields are filled
        return userData.name && userData.surname && userData.email && userData.password;
    };

    const handleSignupSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!isPasswordComplex(userData.password)) {
            setSignUpError("Password must be at least 8 characters long and contain a capital letter.");
            Alert.alert("Error", signUpError);
            return;
        }

        try {
            const response = await axios.post(`${apiBaseUrl}/create_user`, userData);
            if (response.status === 201) {
                Alert.alert("Success", "User created successfully");
                setUserData({ name: '', surname: '', email: '', password: '' });
                onCancel();
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert("Error", `Failed to create user: ${error.message}`);
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onCancel}
            onRequestClose={onCancel}
            style={styles.modal}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <Text style={styles.signupTitle}>Sign Up</Text>
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor="#808080"
                        value={userData.name}
                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Surname"
                        placeholderTextColor="#808080"
                        value={userData.surname}
                        onChangeText={(text) => setUserData({ ...userData, surname: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#808080"
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#808080"
                        secureTextEntry
                        value={userData.password}
                        onChangeText={(text) => setUserData({ ...userData, password: text })}
                        style={styles.input}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSignupSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    signupTitle: {
        color: '#FFF',
        paddingVertical: 10,
        fontSize: 20,
    },
    container: {
        width: 300,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#05445E",
        alignItems: 'center',
    },
    input: {
        borderColor: '#189AB4',
        backgroundColor: '#1A2F38',
        color: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        width: '100%',
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#189AB4',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        minHeight: 45,
    },
    cancelButton: {
        marginTop: 5,
    },
    buttonText: {
        color: '#FFF',
    },
});

export default SignupModal;