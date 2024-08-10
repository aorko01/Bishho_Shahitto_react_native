import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfile({ navigation }) {
  const [user, setUser] = useState({
    username: 'Ali123',
    email: 'ali@example.com',
    firstName: 'Ali',
    middleName: '',
    lastName: 'Ahmed',
    avatar:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTP9hneBUzKcWY0lZAnnIP9-rPOWqP9lsVIO5iihMwrKsTcevg2OehToQ3wb-1z3FNIWJ4nWEqdd5AunJjSCdwTFbWgAW5mFSxlRp56Og',
  });

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

  const handleSave = () => {
    // Save logic here
    console.log('Updated User:', user);
    navigation.goBack();
  };

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
          {/* Input fields for username, email, first name, middle name, and last name */}
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

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
});
