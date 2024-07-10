import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Dummy data for user ratings
const userRatings = [
  { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'John Doe', stars: 4 },
  { id: 2, avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Jane Smith', stars: 5 },
  { id: 3, avatar: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'David Brown', stars: 3 },
  { id: 4, avatar: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Emma Johnson', stars: 4 },
  { id: 5, avatar: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Sophia Williams', stars: 5 },
];

export default function IndividualBook() {
  const navigation = useNavigation();
  const route = useRoute();
  const {book} = route.params;

  const coverImage = book.coverImage; // Assuming coverImage is a field in your book object

  const coverImages = [
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
  ];

  const handleBorrow = () => {
    // Implement borrow logic here
    console.log(`Borrowing book: ${book.title}`);
  };

  const handleBookmark = () => {
    // Implement bookmark logic here
    console.log(`Bookmarking book: ${book.title}`);
  };

  // Render stars for user to rate the book
  const renderRatingStars = () => {
    // Code to render stars goes here
    // This can be implemented using TouchableOpacity and Icon components for stars
    return (
      <View style={styles.ratingStars}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity key={index}>
            <Icon name="star" size={30} color="#f8c104" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render user ratings section
  const renderUserRatings = () => {
    return (
      <View style={styles.userRatings}>
        <Text style={styles.ratingTitle}>Your Rating</Text>
        {renderRatingStars()}
        <Text style={styles.ratingTitle}>User Ratings</Text>
        {userRatings.map((user) => (
          <View key={user.id} style={styles.userRating}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.userStars}>
                {[...Array(user.stars)].map((_, index) => (
                  <Icon key={index} name="star" size={18} color="#f8c104" />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notification}>
          <Icon name="notifications" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.bookHead}>
          <View style={styles.imageContainer}>
            <Image source={{uri: coverImage}} style={styles.bookCoverMain} />
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.author}>By {book.author}</Text>
            <Text style={styles.author}>Rating: {book.totalRating}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleBorrow}
                style={styles.borrowButton}>
                <LinearGradient
                  colors={['#f7605e', '#e44243']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.linearGradient}>
                  <Text style={styles.borrowText}>Borrow</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBookmark}
                style={styles.bookmarkButton}>
                <Icon name="bookmark" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bookDescription}>
          <Text style={styles.descriptionTitle}>Synopsis</Text>
          <Text style={styles.descriptionText}>{book.description}</Text>
        </View>

        <View style={styles.sectionContainer2}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image key={idx} source={{uri: image}} style={styles.bookCover} />
            ))}
          </ScrollView>
        </View>

        {/* Render the rating section */}
        <View style={styles.ratingSection}>
          {renderUserRatings()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEE',
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 15,
    zIndex: 1,
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 15,
    zIndex: 1,
  },
  bookHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1b2b',
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageContainer: {
    zIndex: 0,
  },
  bookCoverMain: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  bookDetails: {
    flex: 1,
    marginLeft: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  author: {
    color: '#fff',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  borrowButton: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  borrowText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  bookmarkButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f7605e',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookDescription: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 20,
    borderRadius: 10,
    minHeight: 150,
    backgroundColor: '#fff',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  descriptionText: {
    color: 'black',
    lineHeight: 22,
  },
  sectionContainer2: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  TrendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  Heading: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  all: {
    color: '#888',
    fontSize: 16,
    marginTop: 5,
  },
  horizontalScroll: {
    paddingLeft: 15,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  ratingSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userRatings: {
    marginTop: 20,
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
  },
  userStars: {
    flexDirection: 'row',
  },
});
