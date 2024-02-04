// src/screens/ThreadsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

import useStore from '../store/store';
import useAppSettings from '../store/useAppSettings';
import { translate } from '../components/translate';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { useTheme } from '../context/ThemeContext';

const ThreadsScreen = ({ isActive, navigateToScreen }) => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentThread, setCurrentThread] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const user = useStore(state => state.user);
  const { language } = useAppSettings();
  const dynamicStyles = useDynamicStyles();
  const { theme } = useTheme();

  const iconColor = theme === 'dark' ? "#FFF" : "#05445E";

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  useEffect(() => {
    if (isActive && user?.id) {
      setIsLoading(true);
      const cleanupAndFetchThreads = async () => {
        await axios.post(`${apiBaseUrl}/cleanup_empty_threads`, { user_id: user.id });
        await fetchThreads();
      };
      cleanupAndFetchThreads().finally(() => setIsLoading(false));
    }
  }, [isActive, user?.id]);

  // Function to fetch threads
  const fetchThreads = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/get_user_threads`, { user_id: user.id });
      console.log('Fetched threads:', response.data.threads);
      setThreads(response.data.threads || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  useEffect(() => {
    if (isActive && user?.id) {
      fetchThreads();
    }
  }, [isActive, user?.id]);

  const handleThreadClick = (threadId) => {
    navigateToScreen(1, { selectedThreadId: threadId }); // Navigate to BotScreen with selected thread ID
  };

  const openThreadOptionsModal = (thread) => {
    setCurrentThread(thread);
    setNewTitle(thread.title);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (newTitle.length > 50) {
      alert('Title cannot be more than 50 characters.');
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/update_thread_title`, { thread_id: currentThread.thread_id, title: newTitle });
      fetchThreads();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating thread title:', error);
    }
  };

  const handleDeleteThread = async () => {
    try {
      await axios.post(`${apiBaseUrl}/delete_thread`, { thread_id: currentThread.thread_id });
      fetchThreads();
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={dynamicStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#189AB4" />
      </View>
    );
  }

  return (
    <View style={dynamicStyles.threadsContainer}>
      {/* Thread Options Modal */}
      <Modal
        animationType="slide"
        style={dynamicStyles.modal}
        transparent={true}
        visible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dynamicStyles.centeredView}>
          <View style={dynamicStyles.modalView}>
            <TextInput
              style={dynamicStyles.modalInput}
              onChangeText={setNewTitle}
              value={newTitle}
              autoFocus={true}
            />
            <View style={dynamicStyles.modalButtons}>
              <TouchableOpacity style={dynamicStyles.threadsButton} onPress={() => setModalVisible(false)}>
                <Text style={dynamicStyles.textStyle}>{translate('threadsCancel', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.threadsButton} onPress={handleSaveEdit}>
                <Text style={dynamicStyles.textStyle}>{translate('threadsSave', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[dynamicStyles.threadsButton, dynamicStyles.deleteButton]} onPress={handleDeleteThread}>
                <Text style={dynamicStyles.textStyle}>{translate('threadsDelete', language)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Thread Listing */}
      <Text style={dynamicStyles.threadsTitle}>{translate('threadsTitle', language)}</Text>
      
      <Text style={dynamicStyles.botWelcomeText}>
        {user ? `Hi, ${user.name}.` : 'Log in to see your saved threads listed here'}
      </Text>

      <FlatList
        data={threads}
        keyExtractor={item => item.thread_id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.threadItem}>
            <TouchableOpacity onPress={() => handleThreadClick(item.thread_id)}>
              <Text style={dynamicStyles.threadTitle}>{item.title || 'Untitled Thread'}</Text>
              <Text style={dynamicStyles.threadDate}>{item.date}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openThreadOptionsModal(item)}>
              <AntDesign name="edit" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ThreadsScreen;
