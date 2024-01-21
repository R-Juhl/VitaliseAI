// src/screens/BotScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, 
  ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';
import useStore from '../store/store';

const BotScreen = ({ isActive, route }) => {
  const scrollViewRef = useRef();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useStore(state => state.user);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [sound, setSound] = useState(null);
  const [recording, setRecording] = useState();

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  useEffect(() => {
    if (!user?.id) {
      setMessages([{ text: "You need to be signed in to use the chat bot", role: "system" }]);
      return;
    }
    if (user.id && isActive) {
      setIsLoading(true);

      if (route.params?.selectedThreadId) {
        setThreadId(route.params.selectedThreadId);
        loadThreadMessages(route.params.selectedThreadId);
      } else if (!threadId) {
        createNewThreadAndFetchMessage(user.id);
      }
    }
  }, [route.params?.selectedThreadId, user?.id, isActive, threadId]);

  const loadThreadMessages = async (threadId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/get_thread_messages`, { thread_id: threadId });
      const formattedMessages = response.data.messages.map(msg => ({
        text: msg.text,
        role: msg.role
      })).reverse(); // Reversing the message array
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThreadAndFetchMessage = async (userId) => {
    try {
      const createResponse = await axios.post(`${apiBaseUrl}/create_new_thread`, { user_id: userId });
      const newThreadId = createResponse.data.thread_id;
      setThreadId(newThreadId);
      await fetchInitialMessage(newThreadId, userId);
    } catch (error) {
      console.error('Error creating new thread:', error);
    }
  };

  const fetchInitialMessage = async (threadId, userId) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/thread_initial`, {
        params: { thread_id: threadId, user_id: userId }
      });
      setMessages([{
        text: response.data.message, 
        role: 'assistant'
      }]);
    } catch (error) {
      console.error('Error fetching initial message:', error);
    }
  };

  // Handle sending new message
  const handleSendMessage = async (messageText) => {
    // Check if messageText is undefined or if it's an empty string after trimming
    if (!messageText || !messageText.trim()) return;
  
    const newUserMessage = { text: messageText, role: 'user' };
    setMessages([...messages, newUserMessage]);
  
    if (messages.length === 1) {  // Check if it's the first user message
      generateThreadTitle(threadId, messageText);
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/thread_continue`, {
        thread_id: threadId,
        user_input: messageText
      });
      const newAssistantMessage = { text: response.data.message, role: 'assistant' };
      setMessages(currentMessages => [...currentMessages, newAssistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateThreadTitle = async (threadId, userInput) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/generate_thread_title`, {
        thread_id: threadId,
        user_input: userInput
      });
      if (response.data.error) {
        console.error("Error generating title:", response.data.error);
      } else {
        console.log("Thread title generated:", response.data.title);
      }
    } catch (error) {
      console.error("Error in generating thread title:", error);
    }
  };
  

  // Handle thread creation and loading
  useEffect(() => {
    if (!user?.id || !isActive) return; // Ensure user is logged in and the screen is active
  
    const initiateThread = async () => {
      if (!threadId) {
        const createResponse = await axios.post(`${apiBaseUrl}/create_new_thread`, { user_id: user.id });
        setThreadId(createResponse.data.thread_id);
        fetchInitialMessage(createResponse.data.thread_id, user.id);
      } else {
        loadThreadMessages(threadId);
      }
    };
  
    initiateThread();
  }, [user?.id, isActive, threadId]);


  const handleAttach = () => {
    // Placeholder for future implementation
    console.log('Attach button pressed');
  };

  const handleNewChat = async () => {
    const createResponse = await axios.post(`${apiBaseUrl}/create_new_thread`, { user_id: user.id });
    setThreadId(createResponse.data.thread_id);
    fetchInitialMessage(createResponse.data.thread_id);
  };

  const playAudio = async (text, index) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setPlayingAudio(null); // Reset playing audio state when a new audio is about to play
    }
  
    try {
      const response = await axios.post(`${apiBaseUrl}/text_to_speech`, { text });
      const audioUrl = response.data.audio_url;
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
  
      // Set the sound object in the state
      setSound(newSound);
      setPlayingAudio({ sound: newSound, index });
  
      // Add a listener to the sound object
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          // Audio playback finished, update state
          setPlayingAudio(null);
        }
      });
  
      // Start playing the audio
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // useEffect hook for handling audio stop when navigating away
  useEffect(() => {
    // Unload the sound when the component unmounts or isActive changes to false
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound, isActive]);

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync(); // Stop the audio playback
      await sound.unloadAsync(); // Unload the sound to free up resources
      setSound(null); // Reset the sound state
      setPlayingAudio(null); // Reset the playing audio state
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,  // Adjust if needed to support mp3
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    sendVoiceMemo(uri, 'mp3');  // Specify the format here
  };

  const sendVoiceMemo = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'voice-memo.mp3',
      type: 'audio/mp3'
    });

    try {
      const uploadResponse = await axios.post(`${apiBaseUrl}/upload_voice_memo`, formData);
      const fileUrl = uploadResponse.data.file_url;

      const transcribeResponse = await axios.post(`${apiBaseUrl}/transcribe_voice_memo`, { file_url: fileUrl });
      const transcript = transcribeResponse.data.transcript;

      // Send the transcript as a message
      handleSendMessage(transcript);
    } catch (error) {
      console.error('Error sending voice memo:', error);
    }
  };

  const renderMessage = (message, role, index) => {
    if (role === 'system') {
      // Render system messages as plain text
      return (
        <View key={`message-${index}`} style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{message.text}</Text>
        </View>
      );
    } else {
      // Render other messages with audio functionality
      return renderMessageWithAudio(message, role, index);
    }
  };

  const renderMessageWithAudio = (message, role, index) => {
    const isPlaying = playingAudio && playingAudio.index === index;
    const messageStyle = role === 'user' ? styles.userMessage : styles.assistantMessage;
    const containerStyle = role === 'user' ? styles.userContainer : styles.assistantContainer;
    const iconColor = role === 'user' ? '#FFF' : '#1A2F38';

    return (
      <View style={containerStyle} key={`message-${index}`}>
        <View style={messageStyle}>
          {formatText(message.text, role)}
          <TouchableOpacity onPress={() => isPlaying ? stopAudio() : playAudio(message.text, index)}>
            <AntDesign name={isPlaying ? "pausecircle" : "sound"} 
              size={24} 
              color={iconColor} 
              paddingTop={5} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Function to format text
  const formatText = (text, role = 'assistant') => {
    if (!text) {
      return <Text style={styles.message}>No message text available.</Text>;
    }
  
    // Split the text by line breaks
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Replace markdown-like bold syntax with bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
  
      return (
        <Text key={index} style={role === 'system' ? styles.systemMessage : (role === 'user' ? styles.messageUser : styles.messageAssistant)}>
          {parts.map((part, i) => {
            // Every second part is the bold text (due to how split works with regex)
            if (i % 2 === 1) {
              return <Text key={i} style={styles.bold}>{part}</Text>;
            }
            return part;
          })}
        </Text>
      );
    });
  
    return formattedLines;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 25 : 0}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* Bot Icon */}
          <View style={styles.botIconContainer}>
            <Image  
              source={require('../../assets/images/bot.png')}
              style={styles.botIcon}
            />
            <Text style={styles.botTitle}>Longevity Genie</Text>
          </View>

          {/* Message History */}
          <View style={styles.messageContainer}>
            <View style={styles.messageHistory}>
              <ScrollView 
                style={styles.scrollView} 
                ref={scrollViewRef} 
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              >
                {!isLoading && messages.length === 0 && user?.id && (
                  <Text style={styles.placeholderText}>
                    Start a new conversation
                  </Text>
                )}
                {messages.map((message, index) => (
                  renderMessage(message, message.role, index)
                ))}
                {isLoading && <ActivityIndicator 
                  size="large" 
                  color="#189AB4" 
                  style={{ marginTop: 20 }} 
                />}
              </ScrollView>
            </View>
          </View>

          {/* Message Input, Attach Button, and Send Button */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder="Type message here"
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.attachButton} onPress={handleAttach}>
              <AntDesign name="pluscircleo" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage(userMessage)}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {/* Record Button and New/Exit Chat Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.sideButton}>
              <Text style={styles.sideButtonText}>Close Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
              <Image 
                source={recording ? require('../../assets/images/voiceLoading.png') : require('../../assets/images/recordingIcon.png')}
                style={styles.recordIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideButton} onPress={handleNewChat}>
              <Text style={styles.sideButtonText}>New Chat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2F38',
  },
  safeArea: {
    flex: 1,
    marginHorizontal: wp(5),
  },
  systemMessageContainer: {
    padding: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemMessageText: {
    color: 'white',
    fontSize: 16,
  },
  userContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: wp(1),
    marginVertical: 5,
  },
  assistantContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: wp(1),
    marginVertical: 5,
  },
  userMessage: {
    maxWidth: '90%',
    alignSelf: 'flex-end',
    backgroundColor: '#218aff',
    padding: 10,
    borderRadius: 10,
  },
  assistantMessage: {
    maxWidth: '90%',
    alignSelf: 'flex-start',
    backgroundColor: '#d8d8d8',
    padding: 10,
    borderRadius: 10,
  },
  botIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  botIcon: {
    height: hp(10),
    width: hp(10),
  },
  botTitle: {
    color: '#FFF',
    fontSize: wp(5),
    fontWeight: 'bold',
    marginTop: hp(1),
  },
  messageContainer: {
    flex: 1,
    marginTop: hp(1),
  },
  systemMessage: {
    color: '#FFF',
    fontSize: 16,
  },
  message: {
    color: '#FFF',
    fontSize: 16,
  },
  messageUser: {
    color: '#FFF',
    fontSize: 16,
  },
  messageAssistant: {
    color: 'black',
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#218aff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#d8d8d8',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageHistory: {
    flex: 1,
    backgroundColor: '#05445E',
    borderRadius: 20,
    padding: wp(4),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  messageWithAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  scrollView: {
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    fontSize: wp(4),
    color: '#1A2F38',
  },
  attachButton: {
    marginLeft: wp(1),
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#05445E',
    borderRadius: 20,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: wp(4),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(0),
  },
  recordButton: {
    marginHorizontal: wp(5),
  },
  recordIcon: {
    width: hp(10),
    height: hp(10),
  },
  sideButton: {
    backgroundColor: '#05445E',
    borderRadius: 20,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  sideButtonText: {
    color: '#FFF',
    fontSize: wp(4),
  },
  placeholderText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: hp(2),
  },
});

export default BotScreen;

