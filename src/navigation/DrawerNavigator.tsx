import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import BottomNavigation from './BottomNavigation';
import SettignsScreen from '../screen/SettignsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
      await AsyncStorage.removeItem('accessToken');  // Remove access token from AsyncStorage
      navigation.replace('Login');  // Navigate to the Login screen
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerItems}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => (
            <Icon name="home" color="#fff" size={size} />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Icon name="settings" color="#fff" size={size} />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Settings')}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // Set to true if you want to show headers for the screens in the drawer
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Home" 
        component={BottomNavigation} 
        options={{ title: 'Home' }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettignsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1a1b2b', // Keep the background color
  },
  drawerItems: {
    paddingTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#fff', // Keep the text color white
    marginLeft: -16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e74c3c',
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff', // Keep the text color white
    fontSize: 16,
    marginLeft: 10,
  },
});

export default DrawerNavigator;
