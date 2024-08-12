import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    username: 'Loading...',
    email: 'Loading...',
    avatar: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTP9hneBUzKcWY0lZAnnIP9-rPOWqP9lsVIO5iihMwrKsTcevg2OehToQ3wb-1z3FNIWJ4nWEqdd5AunJjSCdwTFbWgAW5mFSxlRp56Og',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const likedBooks = [
    {
      id: 1,
      title: 'Book Title 1',
      coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    },
    {
      id: 2,
      title: 'Book Title 2',
      coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    },
  ];

  const reviews = [
    {
      id: 1,
      bookTitle: 'Book Title 1',
      coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
      review: 'Great book! Highly recommended.',
      likes: 10,
    },
    {
      id: 2,
      bookTitle: 'Book Title 2',
      coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
      review: 'Interesting read, but a bit slow in the middle.',
      likes: 5,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Navigate back when back button is pressed
          >
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="more-vert" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liked Books</Text>
          <ScrollView horizontal style={styles.horizontalScroll}>
            {likedBooks.map((book) => (
              <View key={book.id} style={styles.bookItem}>
                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
                <Text style={styles.bookTitle}>{book.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Reviews</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewContainer}>
              <Image source={{ uri: review.coverImage }} style={styles.reviewBookCover} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewBookTitle}>{review.bookTitle}</Text>
                <Text style={styles.reviewText}>{review.review}</Text>
                <View style={styles.likesContainer}>
                  <Icon name="favorite" size={20} color="red" />
                  <Text style={styles.likesCount}>{review.likes} Likes</Text>
                </View>
              </View>
            </View>
          ))}
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
    position: 'relative',
    height: 50,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  menuButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  editProfileButton: {
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 15,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  horizontalScroll: {
    paddingLeft: 15,
  },
  bookItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  bookTitle: {
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2a2b3c',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  reviewBookCover: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewBookTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    color: 'white',
    marginBottom: 10,
    fontSize: 16,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
});
