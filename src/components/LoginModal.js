// /src/components/LoginModal.js
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import useStore from '../store/store';

const LoginModal = ({ isVisible, onCancel }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const setUser = useStore(state => state.setUser);

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, loginData);
      console.log("Login response data:", response.data);
      if (response.status === 200) {
        setUser({
          name: response.data.user,
          id: response.data.user_id,
          // add more user-related data here if needed
        });
        onCancel();
        console.log("Logged in user:", response.data.user);
      } else {
        Alert.alert("Login Failed", response.data.error);
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert("Error", "Failed to login.");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      onRequestClose={onCancel}
      style={styles.modal}
      backdropOpacity={0.5}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <Text style={styles.loginTitle}>Login</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#808080"
            value={loginData.email}
            onChangeText={(text) => setLoginData({ ...loginData, email: text })}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#808080"
            secureTextEntry
            value={loginData.password}
            onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLoginSubmit} style={styles.button}>
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
  loginTitle: {
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
    padding: 5,
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

export default LoginModal;