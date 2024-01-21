// /src/components/SettingsModal.js
import React, { useState } from 'react';
import { Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Button, YStack, Input } from 'tamagui';
import axios from 'axios';
import useStore from '../store/store';

const SettingsModal = ({ isVisible, onCancel }) => {
  const setUser = useStore(state => state.setUser);

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  return (
    <Modal
        isVisible={isVisible}
        onBackdropPress={onCancel}
        onRequestClose={onCancel}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <YStack
          width={300}
          padding={20}
          borderRadius={10}
          backgroundColor="#05445E"
          alignItems="center"
          space="$2" // Adjust the spacing between elements inside YStack
        >
        <YStack direction="row" justifyContent="space-between" width="50%" height={80} space="$2">
          <Button onPress={onCancel} style={{ backgroundColor: '#189AB4', flex: 1 }}>Cancel</Button>
        </YStack>
      </YStack>
    </Modal>
  );
};

export default SettingsModal;