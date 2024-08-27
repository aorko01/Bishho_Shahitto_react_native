import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import SettignsScreen from '../screen/SettignsScreen';
import Profile from '../screen/Profile';
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
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerItems}>
        <DrawerItem
          label="Profile"
          icon={({ color, size }) => (
            <Icon name="person-outline" color="#fff" size={size} />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Profile')}
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
        headerShown: false,
        gestureEnabled: true,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Bottom_nativationrr" component={BottomNavigation} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={SettignsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1a1b2b',
  },
  drawerItems: {
    paddingTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#fff',
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
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default DrawerNavigator;
