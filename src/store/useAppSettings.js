// /src/store/useAppSettings.js
import { create } from 'zustand';

const useAppSettings = create(set => ({
  language: 'en',
  displaySetting: 'dark',
  voiceSetting: 1,
  voiceSpeedSetting: 1.0,
  autoPlayAudioSetting: false,
  updateSettings: settings => set({ ...settings })
}));

export default useAppSettings;
