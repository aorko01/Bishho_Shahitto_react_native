import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../screen/Home';
import Profile from '../screen/Profile';
import BorrowedBooks from '../screen/BorrowedBooks';
import Search from '../screen/Search';
import Requested from '../screen/Requested';
import BrowseBooks from '../screen/BrowseBook';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let IconComponent;
          let label;
          let iconStyle = {};
          let labelStyle = styles.label;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              IconComponent = Ionicons;
              label = 'Home';
              break;
            case 'BorrowedBooks':
              iconName = 'book';
              IconComponent = MaterialIcons;
              label = 'Borrowed';
              break;
            case 'Search':
              iconName = 'search-outline';
              IconComponent = Ionicons;
              label = 'Search';
              iconStyle = styles.searchIconContainer;
              labelStyle = [styles.label, styles.searchLabel];
              break;
            case 'BrowseBooks':
              iconName = 'library-books';
              IconComponent = MaterialIcons;
              label = 'BrowseBooks';
              break;
            case 'Profile':
              iconName = 'person-outline';
              IconComponent = Ionicons;
              label = 'Profile';
              break;
            default:
              iconName = 'ellipse-outline';
              IconComponent = Ionicons;
              label = '';
          }

          return (
            <View style={styles.iconContainer}>
              <View style={iconStyle}>
                <IconComponent name={iconName} size={size} color={color} />
              </View>
              <Text style={labelStyle}>{label}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="BrowseBooks" component={BrowseBooks} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="BorrowedBooks" component={BorrowedBooks} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: 'black',
  },
  searchLabel: {
    paddingTop: 10,
  },
  searchIconContainer: {
    width: 50,
    height: 50,
    marginBottom: 22,
    borderRadius: 25,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
