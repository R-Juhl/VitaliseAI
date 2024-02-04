// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import axios from 'axios';

import useStore from '../store/store';
import useAppSettings from '../store/useAppSettings';
import { translate } from '../components/translate';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

const ProfileScreen = () => {
  const user = useStore(state => state.user);
  const { language } = useAppSettings();
  const dynamicStyles = useDynamicStyles();

  const [showCustomGoalInput, setShowCustomGoalInput] = useState(false);
  const [profileData, setProfileData] = useState({
    age: '',
    height: '',
    fitnessLevel: 5,
    dietaryRestrictions: '',
    healthConditions: '',
    goals: { longevity: false, athleticism: false, weightLoss: false, muscleGain: false, mobility: false },
    additionalGoals: '',
    heightUnit: 'cm'
  });

  const apiBaseUrl = 'http://enormous-mallard-noted.ngrok-free.app';

  useEffect(() => {
    // Fetch profile data logic
    if (user?.id) {
        fetchProfileData();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/get_user_profile`, { user_id: user.id });
      if (response.data) {
        const {
          age,
          height,
          fitness_level,
          dietary_restrictions,
          health_conditions,
          goals,
          height_unit,
        } = response.data;
  
        // Safely convert numeric values to strings, handling null values
        setProfileData({
          age: age !== null ? age.toString() : '', // Provide an empty string if null
          height: height !== null ? height.toString() : '', // Provide an empty string if null
          fitnessLevel: fitness_level || 5, // Default to 5 if null or undefined
          dietaryRestrictions: dietary_restrictions || 'None', // Default to 'None' if empty
          healthConditions: health_conditions || 'None', // Default to 'None' if empty
          goals: goals || { longevity: false, athleticism: false, weightLoss: false, mobility: false }, // Provide default goals if null
          additionalGoals: goals?.additionalGoals || '', // Safe navigation for additionalGoals
          heightUnit: height_unit || 'cm', // Default to 'cm' if null or undefined
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("Error", "Failed to fetch profile settings. Using default values.");
    }
  };  
     

  const handleInputChange = (name, value) => {
      setProfileData(prevData => ({
          ...prevData,
          [name]: value
      }));
  };

  const handleCheckboxChange = (name, checked) => {
    if (name === "other") {
        setShowCustomGoalInput(checked);
    }
    setProfileData(prevData => ({
        ...prevData,
        goals: {
            ...prevData.goals,
            [name]: checked,
        }
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
  
    // Update dietaryRestrictions and healthConditions to default to "None" if empty
    const updatedProfileData = {
      ...profileData,
      dietaryRestrictions: profileData.dietaryRestrictions.trim() === '' ? 'None' : profileData.dietaryRestrictions,
      healthConditions: profileData.healthConditions.trim() === '' ? 'None' : profileData.healthConditions,
    };
  
    const profileSubmission = {
      ...updatedProfileData,
      user_id: user.id,
      age: updatedProfileData.age ? parseInt(updatedProfileData.age, 10) : null,
      height: updatedProfileData.height ? parseInt(updatedProfileData.height, 10) : null,
      fitnessLevel: updatedProfileData.fitnessLevel ? parseInt(updatedProfileData.fitnessLevel, 10) : null,
      // Convert other fields as necessary (for future numerical settings)
    };
  
    try {
      await axios.post(`${apiBaseUrl}/update_user_profile`, profileSubmission);
      Alert.alert("Success", "Profile settings were saved successfully.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      Alert.alert("Error", "Failed to save profile settings.");
    }
  };

   // Goals layout
   const GoalItem = ({ icon, goalKey, label }) => (
    <View style={dynamicStyles.goalItemContainer}>
      <Text style={dynamicStyles.goalLabel}>{label}</Text>
      {icon}
      <Switch
        disabled={!user?.id}
        style={dynamicStyles.goalSwitch}
        value={profileData.goals[goalKey]}
        onValueChange={(value) => handleCheckboxChange(goalKey, value)}
      />
    </View>
  );
  const CustomGoalItem = ({ icon, label, onValueChange, value }) => (
    <View style={dynamicStyles.goalItemContainer}>
      <Text style={dynamicStyles.goalLabel}>{label}</Text>
      {icon}
      <Switch
        disabled={!user?.id}
        style={dynamicStyles.goalSwitch}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );


  return (
    <View style={dynamicStyles.profileContainer}>
      <Text style={dynamicStyles.profileTitle}>{translate('profileTitle', language)}</Text>
      <ScrollView style={dynamicStyles.profileScrollviewContainer}>

      {/* Welcome Message */}
      <Text style={dynamicStyles.profileWelcomeText}>
        {user ? `Hi, ${user.name}.` : 'Log in to fill out your profile.'}
      </Text>

      {/* Age & Height Section */}
      <Text style={dynamicStyles.profileInputTitle}>Age & Height</Text>

      <TextInput
        editable={!!user?.id}
        style={dynamicStyles.profileInput}
        value={profileData.age}
        onChangeText={text => handleInputChange('age', text)}
        keyboardType="numeric"
        placeholder="Age"
        placeholderTextColor={dynamicStyles.profileInputPlaceholder.color}
      />
      <TextInput
        editable={!!user?.id}
        style={dynamicStyles.profileInput}
        value={profileData.height}
        onChangeText={text => handleInputChange('height', text)}
        keyboardType="numeric"
        placeholder="Height"
        placeholderTextColor={dynamicStyles.profileInputPlaceholder.color}
      />

      {/* Height Unit Picker */}
      <View style={dynamicStyles.profilePickerSection}>
        <RNPickerSelect
          disabled={!user?.id}
          onValueChange={(itemValue) => handleInputChange('heightUnit', itemValue)}
          items={[
            { label: 'cm', value: 'cm' },
            { label: 'inches', value: 'inches' },
          ]}
          style={dynamicStyles.profilePicker}
          value={profileData.heightUnit}
        />
      </View>

      {/* Fitness Level Slider */}
      <Text style={dynamicStyles.profileInputTitle}>Fitness Level</Text>
      <Slider
        disabled={!user?.id}
        style={dynamicStyles.profileSlider}
        value={profileData.fitnessLevel}
        onValueChange={(value) => handleInputChange('fitnessLevel', value)}
        minimumValue={1}
        maximumValue={10}
        step={1}
      />
      <Text style={dynamicStyles.profileFitnessLevel}>{`Fitness Level: ${profileData.fitnessLevel}`}</Text>

      {/* Dietary Restrictions Section */}
      <Text style={dynamicStyles.profileInputTitle}>Any Dietary Restrictions / Allergies</Text>
      <TextInput
        editable={!!user?.id}
        style={dynamicStyles.profileInput}
        value={profileData.dietaryRestrictions}
        onChangeText={text => handleInputChange('dietaryRestrictions', text)}
        placeholder="Dietary Restrictions / Allergies"
        placeholderTextColor={dynamicStyles.profileInputPlaceholder.color}
        multiline
      />

      {/* Health Conditions Section */}
      <Text style={dynamicStyles.profileInputTitle}>Any Health Conditions or Diseases</Text>
      <TextInput
        editable={!!user?.id}
        style={dynamicStyles.profileInput}
        value={profileData.healthConditions}
        onChangeText={text => handleInputChange('healthConditions', text)}
        placeholder="Health Conditions/Diseases"
        placeholderTextColor={dynamicStyles.profileInputPlaceholder.color}
        multiline
      />

      {/* Goals Section */}
      <Text style={dynamicStyles.profileInputTitle}>Your Goals and Ambitions</Text>
      <View style={dynamicStyles.goalsContainer}>
        <GoalItem
          icon={<FontAwesome name="heartbeat" size={24} color={dynamicStyles.goalIcon.color} />}
          goalKey="longevity"
          label="Longevity"
        />
        <GoalItem
          icon={<FontAwesome5 name="running" size={24} color={dynamicStyles.goalIcon.color} />}
          goalKey="athleticism"
          label="Athleticism"
        />
        <GoalItem
          icon={<FontAwesome5 name="weight" size={24} color={dynamicStyles.goalIcon.color} />}
          goalKey="weightLoss"
          label="Weight Loss"
        />
      </View>
      <View style={dynamicStyles.goalsContainer}>
        <GoalItem
          icon={<MaterialIcons name="fitness-center" size={24} color={dynamicStyles.goalIcon.color} />}
          goalKey="muscleGain"
          label="Muscle Gain"
        />
        <GoalItem
          icon={<MaterialCommunityIcons name="yoga" size={24} color={dynamicStyles.goalIcon.color} />}
          goalKey="mobility"
          label="Mobility"
        />
        <CustomGoalItem
          icon={<FontAwesome5 name="question" size={24} color={dynamicStyles.goalIcon.color} />}
          label="Other"
          value={profileData.goals.other}
          onValueChange={(value) => handleCheckboxChange('other', value)}
        />
      </View>
      {showCustomGoalInput && (
      <View style={dynamicStyles.customGoalInputContainer}>
        <TextInput
          editable={!!user?.id}
          style={dynamicStyles.profileInput}
          value={profileData.additionalGoals}
          onChangeText={text => handleInputChange('additionalGoals', text)}
          placeholder="Custom Goal"
          placeholderTextColor={dynamicStyles.profileInputPlaceholder.color}
        />
      </View>
      )}

      {/* Save Button */}
      <TouchableOpacity style={dynamicStyles.profileSaveButton} onPress={handleSubmit}>
        <Text style={dynamicStyles.profileSaveButtonText}>Save</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;