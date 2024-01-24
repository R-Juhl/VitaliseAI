// /src/components/SettingsModal.js
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, Switch } from 'react-native';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import axios from 'axios';

import useStore from '../store/store';
import useAppSettings from '../store/useAppSettings';
import { translate } from './translate';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

const SettingsModal = ({ isVisible, onCancel }) => {
  const user = useStore(state => state.user);
  const updateAppSettings = useAppSettings(state => state.updateSettings);
  const { language } = useAppSettings();
  const dynamicStyles = useDynamicStyles();

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [playbackVoice, setPlaybackVoice] = useState('Default');
  const [darkMode, setDarkMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  const languageOptions = [
    { label: translate('English', selectedLanguage), value: 'en' },
    { label: translate('Danish', selectedLanguage), value: 'dk' },
    // Add more languages
  ];

  const playbackVoiceOptions = [
    { label: 'Echo', value: 'Echo' },
    { label: 'Alloy', value: 'Alloy' },
    { label: 'Fable', value: 'Fable' },
    { label: 'Onyx', value: 'Onyx' },
    { label: 'Nova', value: 'Nova' },
    { label: 'Shimmer', value: 'Shimmer' },
  ];
  const playbackVoiceMap = {
    1: 'Echo',
    2: 'Alloy',
    3: 'Fable',
    4: 'Onyx',
    5: 'Nova',
    6: 'Shimmer',
  };

  useEffect(() => {
    if (isVisible && user?.id) {
      axios.post(`${apiBaseUrl}/get_user_settings`, { user_id: user.id })
        .then(response => {
          const settings = response.data;
          setSelectedLanguage(settings.language);;
          setDarkMode(settings.display_setting === 'dark');
          setPlaybackVoice(playbackVoiceMap[settings.voice_setting]);
          setPlaybackSpeed(settings.voice_speed_setting);
          setAutoPlayAudio(settings.autoplaybackaudio_setting);

          // Update Zustand store
          updateAppSettings({
            language: settings.language,
            displaySetting: settings.display_setting,
            voiceSetting: playbackVoiceMap[settings.voice_setting],
            voiceSpeedSetting: settings.voice_speed_setting,
            autoPlayAudioSetting: settings.autoplaybackaudio_setting
          });
        })
        .catch(error => console.error('Error fetching settings:', error));
    }
  }, [isVisible, user?.id, updateAppSettings]);

  const handleSaveSettings = async () => {
    const voiceSettingKey = Object.keys(playbackVoiceMap).find(key => playbackVoiceMap[key] === playbackVoice);

    if (user && user.id) {
        try {
            const response = await axios.post(`${apiBaseUrl}/update_user_settings`, {
                user_id: user.id,
                language: selectedLanguage,
                display_setting: darkMode ? 'dark' : 'light',
                voice_setting: voiceSettingKey,
                voice_speed_setting: playbackSpeed,
                autoplaybackaudio_setting: autoPlayAudio,
            });

            // Update Zustand store after successful response
            if (response.status === 200) {
                updateAppSettings({
                    language: selectedLanguage,
                    displaySetting: darkMode ? 'dark' : 'light',
                    voiceSetting: voiceSettingKey,
                    voiceSpeedSetting: playbackSpeed,
                    autoPlayAudioSetting: autoPlayAudio
                });
                Alert.alert("Settings Saved", "Your settings have been updated.");
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert("Error", "Failed to save settings.");
        }
    } else {
        Alert.alert("Error", "User not identified.");
    }
  };

  const handleLanguageChange = (itemValue) => {
    setSelectedLanguage(itemValue);
    updateAppSettings({ language: itemValue });
  };

  const handleForgetMe = () => {
    // Double confirmation logic
    Alert.alert("Confirm Delete", "This will delete all your data permanently from our database. They will not be recoverable. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => console.log("User data deleted") }
    ]);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      onRequestClose={onCancel}
      style={dynamicStyles.modal}
      animationType="slide"
    >
      <View style={dynamicStyles.modalContainer}>
        <Text style={dynamicStyles.modalTitle}>{translate('settingsTitle', language)}</Text>

        {/* General Settings */}
        <View style={dynamicStyles.modalSection}>
          <Text style={dynamicStyles.modalSectionTitle}>{translate('generalSettings', language)}</Text>
          <Text style={dynamicStyles.modalLabel}>{translate('changeLanguage', language)}</Text>
          <View style={dynamicStyles.modalPickerSection}>
            <RNPickerSelect
              onValueChange={handleLanguageChange}
              items={languageOptions}
              style={dynamicStyles.modalPicker}
              value={selectedLanguage}
            />
          </View>
          <View style={dynamicStyles.modalSwitchContainer}>
            <Text style={dynamicStyles.modalLabel}>{translate('darkMode', language)}</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </View>

        {/* Audio Settings */}
        <View style={dynamicStyles.modalSection}>
          <Text style={dynamicStyles.modalSectionTitle}>{translate('audioSettings', language)}</Text>
          <Text style={dynamicStyles.modalLabel}>{translate('playbackVoice', language)}</Text>
          <View style={dynamicStyles.modalPickerSection}>
            <RNPickerSelect
              onValueChange={(itemValue) => setPlaybackVoice(itemValue)}
              items={playbackVoiceOptions}
              style={dynamicStyles.modalPicker}
              value={playbackVoice}
            />
          </View>
          <View style={dynamicStyles.modalSliderContainer}>
            <Text style={dynamicStyles.modalLabel}>{translate('playbackSpeed', language)} (0.5x - 2.5x)</Text>
            <Slider
              style={dynamicStyles.modalSlider}
              minimumValue={0.5}
              maximumValue={2.5}
              minimumTrackTintColor="#189AB4"
              maximumTrackTintColor="#000000"
              step={0.1}
              value={playbackSpeed}
              onValueChange={setPlaybackSpeed}
            />
            <Text style={dynamicStyles.modalCurrentSpeed}>{playbackSpeed.toFixed(1)}x</Text>
          </View>
          <View style={dynamicStyles.modalSwitchContainer}>
            <Text style={dynamicStyles.modalLabel}>{translate('autoPlayAudio', language)}</Text>
            <Switch
              value={autoPlayAudio}
              onValueChange={setAutoPlayAudio}
            />
          </View>
        </View>

        {/* Forget Me Button */}
        <TouchableOpacity style={dynamicStyles.modalForgetMeButton} onPress={handleForgetMe}>
          <Text style={dynamicStyles.modalButtonText}>{translate('forgetMe', language)}</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={dynamicStyles.modalSaveButton} onPress={handleSaveSettings}>
          <Text style={dynamicStyles.modalButtonText}>{translate('saveSettings', language)}</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity onPress={onCancel} style={dynamicStyles.modalCancelButton}>
          <Text style={dynamicStyles.modalButtonText}>{translate('cancel', language)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SettingsModal;