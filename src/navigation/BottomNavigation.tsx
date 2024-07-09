import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screen/Home';
import Profile from '../screen/Profile';
import BorrowedBooks from '../screen/BorrowedBooks';
import Search from '../screen/Search';
import Requested from '../screen/Requested';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="BorrowedBooks" component={BorrowedBooks} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Requested" component={Requested} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
