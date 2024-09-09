import React, { useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import axios

const API_URI = 'https://hijklmn.aorko.me/api/v1';

export default function Register({ navigation }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    avatar: '', // No default image
    region: '', // New field for region
  });

  const [loading, setLoading] = useState(false); // Loading state

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

  const handleRegister = async () => {
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('firstName', user.firstName);
      formData.append('middleName', user.middleName);
      formData.append('lastName', user.lastName);
      formData.append('password', user.password);
      formData.append('Region', user.region); // Add region to form data

      if (user.avatar) {
        formData.append('avatar', {
          uri: user.avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      // Send POST request to your backend
      const response = await axios.post(`${API_URI}/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Registration successful!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register</Text>
        </View>

        <View style={styles.profileContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>No Image</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton} onPress={selectImage}>
            <Text style={styles.editAvatarText}>Add Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            keyboardType="email-address"
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={user.firstName}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
          />

          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={styles.input}
            value={user.middleName}
            onChangeText={(text) => setUser({ ...user, middleName: text })}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={user.lastName}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
          />

          <Text style={styles.label}>Region</Text>
          <TextInput
            style={styles.input}
            value={user.region}
            onChangeText={(text) => setUser({ ...user, region: text })}
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={user.confirmPassword}
            onChangeText={(text) => setUser({ ...user, confirmPassword: text })}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          )}
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  avatarPlaceholderText: {
    color: 'white',
    fontSize: 16,
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
  registerButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
