import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

export default function EditProfile({ navigation }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    avatar: '',
    region: '',
  });
  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [loadingSave, setLoadingSave] = useState(false); // Loading state for saving

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser({
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            avatar: userData.avatar,
            region: userData.Region,
          });
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage:', error);
      } finally {
        setLoading(false); // Set loading to false once data is loaded
      }
    };

    loadUserData();
  }, []);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setUser({ ...user, avatar: selectedImageUri });
      }
    });
  };

  const handleSave = async () => {
    setLoadingSave(true); // Show loading indicator while saving
    try {
      const formData = new FormData();
      formData.append('username', user.username); // send username from AsyncStorage
      formData.append('email', user.email);
      formData.append('firstName', user.firstName);
      formData.append('middleName', user.middleName);
      formData.append('lastName', user.lastName);
      formData.append('region', user.region);

      if (user.avatar) {
        formData.append('avatar', {
          uri: user.avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      const response = await axiosInstance.post('/users/edit-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoadingSave(false); // Hide loading indicator after saving
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.profileContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton} onPress={selectImage}>
            <Text style={styles.editAvatarText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            keyboardType="email-address"
            editable={!loadingSave}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={user.firstName}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
            editable={!loadingSave}
          />

          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={styles.input}
            value={user.middleName}
            onChangeText={(text) => setUser({ ...user, middleName: text })}
            editable={!loadingSave}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={user.lastName}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
            editable={!loadingSave}
          />

          <Text style={styles.label}>Region</Text>
          <TextInput
            style={styles.input}
            value={user.region}
            onChangeText={(text) => setUser({ ...user, region: text })}
            editable={!loadingSave}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loadingSave}>
            {loadingSave ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 10,
  },
  editAvatarButton: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editAvatarText: {
    color: 'white',
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2a2b3c',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
});
