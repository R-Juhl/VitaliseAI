// /src/components/Header.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import TopMenu from './TopMenu';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import SettingsModal from './SettingsModal';
import DropdownButtons from './DropdownButtons';

import useStore from '../store/store';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { useTheme } from '../context/ThemeContext';

const Header = ({ currentScreen, navigateToScreen }) => {
  const user = useStore(state => state.user);
  const clearUser = useStore(state => state.clearUser);
  const dynamicStyles = useDynamicStyles();
  const { theme } = useTheme();

  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  const handleCancelLogin = () => {
    setLoginModalVisible(false);
  };

  const handleSignup = () => {
    setSignupModalVisible(true);
  };

  const handleCancelSignup = () => {
    setSignupModalVisible(false);
  };

  const handleLogout = async () => {
    clearUser();
  };

  const handleSettings = () => {
    setSettingsModalVisible(true);
  };

  const handleCloseSettings = () => {
    setSettingsModalVisible(false);
  };

  // Function to toggle dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Function to close dropdown and handle button action
  const handleDropdownAction = (action) => {
    setDropdownOpen(false);
    action();
  };

  const renderDropdown = () => (
    <TouchableWithoutFeedback>
      <View style={dynamicStyles.dropdownContainer}>
        <DropdownButtons
          onLogin={() => handleDropdownAction(handleLogin)}
          onLogout={handleLogout}
          onSignup={() => handleDropdownAction(handleSignup)}
          onSettings={() => handleDropdownAction(handleSettings)}
          user={user}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  const iconColor = theme === 'dark' ? "#FFF" : "#05445E";
  const unselectedColor = theme === 'dark' ? "#A9A9A9" : "#696969";
  const homeIconColor = currentScreen === 0 ? iconColor : unselectedColor;

  return (
    <View style={dynamicStyles.headerContainer}>
      
      {/* Home icon */}
      <TouchableOpacity onPress={() => navigateToScreen(0)}>
        <FontAwesome name="home" size={35} color={homeIconColor} />
      </TouchableOpacity>

      {/* Top menu carousel */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TopMenu currentScreen={currentScreen} navigateToScreen={navigateToScreen} />
      </View>

      {/* Dropdown Button Menu */}
      <TouchableOpacity onPress={() => setDropdownOpen(!isDropdownOpen)}>
        <MaterialCommunityIcons name="menu-down" size={35} color={iconColor} />
      </TouchableOpacity>
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleDropdown}
      >
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={dynamicStyles.modalOverlay}>
            {renderDropdown()}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modals */}
      <LoginModal
        isVisible={isLoginModalVisible}
        onCancel={handleCancelLogin}
      />
      <SignupModal
        isVisible={isSignupModalVisible}
        onCancel={handleCancelSignup}
      />
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onCancel={handleCloseSettings}
      />
      
    </View>
  );
};

export default Header;