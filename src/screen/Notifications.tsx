import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from './../utils/axiosInstance';

export default function Notifications() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/users/get-notification'); // Replace with your endpoint
        const { viewedNotifications, notViewedNotifications } = response.data;

        // Combine viewed and not viewed notifications
        setNotifications([...notViewedNotifications, ...viewedNotifications]);

        // If there are not viewed notifications, mark them as viewed
        if (notViewedNotifications.length > 0) {
          await axiosInstance.post('/users/mark-notification-as-viewed', {
            notViewedNotifications,
          });
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to get the icon based on notification type
  const getIconByType = (type) => {
    switch (type) {
      case 'return':
        return 'https://img.icons8.com/ios-filled/100/clock.png';
      case 'Can Borrow':
        return 'https://img.icons8.com/ios-filled/100/star.png';
      case 'borrow':
        return 'https://img.icons8.com/ios-filled/100/book.png';
      case 'liked':
        return 'https://img.icons8.com/ios-filled/100/chat.png';
      default:
        return 'https://img.icons8.com/ios-filled/100/info.png';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Notifications</Text>
        {notifications.map((notification) => (
          <View 
            key={notification._id} 
            style={[
              styles.notificationItem, 
              notification.viewed ? styles.viewed : styles.notViewed
            ]}
          >
            <Image 
              source={{ uri: getIconByType(notification.notificationType) }} 
              style={styles.icon} 
            />
            <View style={styles.textContainer}>
              <Text style={styles.message}>{notification.notificationText}</Text>
              <Text style={styles.time}>{new Date(notification.createdAt).toLocaleTimeString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
  },
  scrollContainer: {
    padding: 15,
  },
  backButton: {
    marginBottom: 20,
  },
  heading: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#2a2b3c',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
  time: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  viewed: {
    opacity: 0.6,  // Make viewed notifications slightly transparent
  },
  notViewed: {
    opacity: 1,    // Keep not viewed notifications fully opaque
  },
});

