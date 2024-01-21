// src/screens/ThreadsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';
import useStore from '../store/store';

const ThreadsScreen = ({ isActive, navigateToScreen }) => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useStore(state => state.user);

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

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#189AB4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.threadsTitle}>Your Threads</Text>
      <FlatList
        data={threads}
        keyExtractor={item => item.thread_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.threadItem} onPress={() => handleThreadClick(item.thread_id)}>
            <Text style={styles.threadTitle}>{item.title || 'Untitled Thread'}</Text>
            <Text style={styles.threadDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2F38',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadsTitle: {
    color: '#FFF',
    fontSize: wp(5),
    fontWeight: 'bold',
    marginTop: hp(1),
  },
  threadItem: {
    backgroundColor: '#05445E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  threadTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  threadDate: {
    color: '#CCC',
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2F38',
  },
});

export default ThreadsScreen;
