import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Notifications() {
  const navigation = useNavigation();

  // Dummy data for notifications
  const notifications = [
    {
      id: 1,
      message: 'Your borrowed book "The Great Gatsby" is due in 3 days.',
      time: '2h ago',
      icon: 'https://img.icons8.com/ios-filled/100/clock.png',
    },
    {
      id: 2,
      message: 'New book "Atomic Habits" has been added to the Top Picks.',
      time: '5h ago',
      icon: 'https://img.icons8.com/ios-filled/100/star.png',
    },
    {
      id: 3,
      message: 'You have successfully borrowed "1984" by George Orwell.',
      time: '1d ago',
      icon: 'https://img.icons8.com/ios-filled/100/book.png',
    },
    {
      id: 4,
      message: 'Your liked book "Sapiens" has received new reviews.',
      time: '3d ago',
      icon: 'https://img.icons8.com/ios-filled/100/chat.png',
    },
  ];

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
          <View key={notification.id} style={styles.notificationItem}>
            <Image source={{ uri: notification.icon }} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.time}>{notification.time}</Text>
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
});
