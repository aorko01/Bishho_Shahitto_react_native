import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axiosInstance from '../utils/axiosInstance.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

// Dummy data for user ratings
const userRatings = [
  {
    id: 1,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'John Doe',
    stars: 4,
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: 'Jane Smith',
    stars: 5,
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'David Brown',
    stars: 3,
  },
  {
    id: 4,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    name: 'Emma Johnson',
    stars: 4,
  },
  {
    id: 5,
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    name: 'Sophia Williams',
    stars: 5,
  },
];

export default function IndividualBook() {
  const navigation = useNavigation();
  const route = useRoute();
  const {book} = route.params;
  const[canBeBorrowed, setCanBeBorrowed] = useState(book?.canBeBorrowed);
  const[confirmBorrow, setConfirmBorrow] = useState(book?.confirmBorrow);
  const[remind, setRemind] = useState(book?.remind);

  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const coverImage = book.coverImage; // Assuming coverImage is a field in your book object
  const bookId = book._id;
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrPayload, setQrPayload] = useState('');

  useEffect(() => {
    fetchUserReviews();
    isthebookLiked();
  }, [bookId]);

  const isthebookLiked = async () => {
    try {
      const response = await axiosInstance.post('/books/check-if-book-liked', {
        bookId,
      });
      setIsLiked(response.data.isLiked);
      console.log(response.data);
    } catch (error) {
      console.error('Error checking if book is liked:', error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await axiosInstance.post('/books/get-reviews', {bookId});
      setReviews(response.data.data);
      console.log('User reviews:', response.data.data.length); // Log updated reviews length
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const coverImages = [
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81FPzmB5fgL._AC_UF1000,1000_QL80_.jpg',
  ];

  const handleBorrow = async () => {
    try {
      // Fetch the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('accessToken');

      // Generate the QR code payload
      const payload = JSON.stringify({
        bookId: bookId,
        accessToken: accessToken,
      });

      // Set the payload and show the modal
      setQrPayload(payload);
      setQrModalVisible(true);

      console.log(`Borrowing book: ${book.title}`);
    } catch (error) {
      console.error('Error handling borrow:', error);
    }
  };


  const handleConfirmBorrow = async () => {
    console.log("borrowing request")
    try {
      const response = await axiosInstance.post('/books/request-borrow', {
        bookId: book._id,
        daysToBorrow: selectedDays,
      });
      console.log(`Borrow request for ${selectedDays} days.`);
      console.log(response.data);
      setCanBeBorrowed(undefined);
      setConfirmBorrow(true);
      setModalVisible(false);
    } catch (error) {
      console.error('Error borrowing the book:', error);
      // Optionally handle the error, e.g., show an alert
    }
  };

  const handleAddReminder = async () => {
    try {
      const response = await axiosInstance.post('/books/add-reminder', {
        bookId: book._id,
      });
      console.log('Reminder added successfully:', response.data);
      setRemind(true);
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  }

  const handleDaySelection = days => {
    if (days >= 1 && days <= 30) {
      setSelectedDays(days);
    }
  };

  const handleBookmark = async () => {
    console.log(`Bookmarking book: ${book.title}`);
    try {
      if (isLiked) {
        console.log(bookId);
        await axiosInstance.post('/books/remove-liked-book', {bookId});
      } else {
        console.log(bookId);
        await axiosInstance.post('/books/add-liked-book', {bookId});
        console.log('Book liked');
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddReview = async () => {
    try {
      const data = {
        bookId: book._id,
        review: reviewText,
      };

      const response = await axiosInstance.post('/books/add-review', data);

      console.log('Review added successfully:', response.data);
      setReviewText('');

      // Refetch reviews after adding a new one
      fetchUserReviews();
    } catch (error) {
      console.error(
        'Error adding review:',
        error.response?.data || error.message,
      );
    }
  };

  const renderActionButton = () => {
    if (canBeBorrowed !== undefined) {
        if (canBeBorrowed) {
            return (
                <TouchableOpacity 
                    style={styles.borrowButton}
                    onPress={() => setModalVisible(true)}
                >
                    <LinearGradient
                        colors={['#4e4890', '#8a4ea3']} // Gradient colors for active state
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.linearGradient}
                    >
                        <Text style={styles.borrowText}>Request</Text>
                    </LinearGradient>
                </TouchableOpacity>
            );
        } else {
            if (remind === true) {
                return (
                    <TouchableOpacity
                        style={[styles.remindButton, styles.remindButtonStyle]}
                        disabled={true} // Make the button non-clickable
                    >
                        <LinearGradient
                            colors={['#c0c0c0', '#a9a9a9']} // Ash color gradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={styles.linearGradient}
                        >
                            <Text style={styles.borrowText}>Remind</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity
                        onPress={handleAddReminder}
                        style={styles.remindButton}
                    >
                        <LinearGradient
                            colors={['#ffa726', '#fb8c00']} // Gradient colors for remind state
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={styles.linearGradient}
                        >
                            <Text style={styles.borrowText}>Remind</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                );
            }
        }
    } else if (confirmBorrow !== undefined && confirmBorrow) {
        return (
            <TouchableOpacity
                style={styles.requestedButton}
                onPress={handleBorrow}
            >
                <LinearGradient
                    colors={['#f7605e', '#e44243']} // Gradient colors for borrowed state
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.linearGradient}
                >
                    <Text style={styles.borrowText}>Borrow</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    } else if ('toReturn' in book && book.toReturn) {
        return (
            <TouchableOpacity 
                style={styles.borrowedButton}
            >
                <LinearGradient
                    colors={['#bdbdbd', '#9e9e9e']} // Gradient colors for borrowed state
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.linearGradient}
                >
                    <Text style={styles.borrowText}>Borrowed</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity 
                onPress={handleBorrow} 
                style={styles.borrowButton}
            >
                <LinearGradient
                    colors={['#f7605e', '#e44243']} // Gradient colors for default state
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.linearGradient}
                >
                    <Text style={styles.borrowText}>Borrow</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
};


  const renderRatingStars = () => {
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

  const renderUserRatings = () => {
    return (
      <View style={styles.userRatings}>
        <Text style={styles.ratingTitle}>Your Rating</Text>
        {renderRatingStars()}
        <Text style={styles.ratingTitle}>User Ratings</Text>
        {userRatings.map(user => (
          <View key={user.id} style={styles.userRating}>
            <Image source={{uri: user.avatar}} style={styles.userAvatar} />
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

  const likeReview = async (reviewId, isLiked) => {
    try {
      const endpoint = isLiked ? '/books/delete-likes' : '/books/add-likes';
      const response = await axiosInstance.post(endpoint, {reviewId});

      console.log(
        `Review ${isLiked ? 'unliked' : 'liked'} successfully:`,
        response.data,
      );

      // Update the reviews state to reflect the changed like status
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? {...review, isLiked: !review.isLiked}
            : review,
        ),
      );
    } catch (error) {
      console.error(
        `Error ${isLiked ? 'unliking' : 'liking'} review:`,
        error.response?.data || error.message,
      );
    }
  };

  const renderUserReviews = () => {
    // Determine the reviews to show based on whether it's expanded or not
    const reviewsToShow = isExpanded
      ? reviews
      : reviews.slice(0, visibleReviews);

    // Handle showing/hiding the "Show More" button
    const hasMoreReviews = reviews.length > visibleReviews;

    return (
      <View style={styles.userReviews}>
        <Text style={styles.reviewTitle}>User Reviews</Text>
        {reviewsToShow.map(review => (
          <View key={review._id} style={styles.userReview}>
            <Image
              source={{
                uri:
                  review.userDetails.avatar ||
                  'https://dummyimage.com/40x40/000/fff',
              }}
              style={styles.reviewAvatar}
            />
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewName}>
                {review.userDetails.username || 'Anonymous'}
              </Text>
              <Text style={styles.reviewText}>{review.review}</Text>
            </View>
            <TouchableOpacity
              onPress={() => likeReview(review._id, review.isLiked)}>
              <Icon
                name="favorite"
                size={24}
                color={review.isLiked ? '#f44336' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        ))}
        {hasMoreReviews && !isExpanded && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setVisibleReviews(visibleReviews + 3)}>
            <Icon name="expand-more" size={30} color="#000" />
            <Text style={styles.showMoreText}>Show More</Text>
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => {
              setIsExpanded(false);
              setVisibleReviews(3);
            }}>
            <Icon name="expand-less" size={30} color="#000" />
            <Text style={styles.showMoreText}>Show Less</Text>
          </TouchableOpacity>
        )}
        {!isExpanded && !hasMoreReviews && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setIsExpanded(true)}>
            <Icon name="expand-less" size={30} color="#000" />
            <Text style={styles.showMoreText}>Show Less</Text>
          </TouchableOpacity>
        )}
        <View style={styles.addReviewContainer}>
          <Text style={styles.addReviewTitle}>Add Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review here..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline
          />
          <TouchableOpacity
            style={styles.submitReviewButton}
            onPress={handleAddReview}>
            <Text style={styles.submitReviewButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.bookHead}>
          <View style={styles.imageContainer}>
            <Image source={{uri: coverImage}} style={styles.bookCoverMain} />
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.author}>By {book.author}</Text>
            <Text style={styles.author}>Rating: {book.totalRating}</Text>
            <View style={styles.buttonsContainer}>
              {renderActionButton()}
              <TouchableOpacity
                onPress={handleBookmark}
                style={styles.bookmarkButton}>
                <Icon
                  name="bookmark"
                  size={30}
                  color={isLiked ? '#3a3c51' : '#EBEBEE'} // Bright yellow for liked, white for not liked
                />
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
            <Text style={styles.Heading}>Similar </Text>
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

        <View style={styles.ratingSection}>{renderUserRatings()}</View>

        <View style={styles.reviewSection}>{renderUserReviews()}</View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={qrModalVisible}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setQrModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Scan QR to Borrow</Text>
                <View style={styles.qrCodeContainer}>
                  <QRCode value={qrPayload} size={200} />
                </View>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => setQrModalVisible(false)}>
                  <Text style={styles.confirmButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Borrow for</Text>
                  <View style={styles.daySelector}>
                    <TouchableOpacity
                      style={styles.dayAdjustButton}
                      onPress={() => handleDaySelection(selectedDays - 1)}>
                      <Text style={styles.adjustButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.dayInput}
                      value={String(selectedDays)}
                      onChangeText={text => handleDaySelection(Number(text))}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={styles.dayAdjustButton}
                      onPress={() => handleDaySelection(selectedDays + 1)}>
                      <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalText}>days</Text>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmBorrow}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      
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
    shadowOffset: {width: 0, height: 2},
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
  reviewSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  userReviews: {
    marginTop: 20,
  },
  userReview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontWeight: 'bold',
    color: 'black',
  },
  reviewText: {
    color: 'black',
  },
  addReviewContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  addReviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  reviewInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: 'black', // Set text color to black
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    backgroundColor: '#09095b',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  submitReviewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
  },
  showMoreText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  remindButton: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  requestedButton: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  borrowedButton: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#1a1b2b',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayAdjustButton: {
    backgroundColor: '#4e4890',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  adjustButtonText: {
    color: 'white',
    fontSize: 20,
  },
  dayInput: {
    backgroundColor: '#3a3c51',
    color: 'white',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 50,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#4e4890',
    padding: 15,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  qrCodeContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 20, // Add margin if needed
  },
});
