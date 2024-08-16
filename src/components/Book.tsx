import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

export default function Book({book, onBookBorrowed}) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [extendModalVisible, setExtendModalVisible] = useState(false);
  

  const renderButtons = () => {
  if (book.confirmBorrow === true) {
    return (
      <TouchableOpacity
        style={[styles.borrowButton, styles.borrowButtonActive]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Borrow</Text>
      </TouchableOpacity>
    );
  }

  if (book.toReturn === undefined) {
    if (book.canBeBorrowed) {
      return (
        <TouchableOpacity
          style={[styles.borrowButton, styles.borrowButtonActive]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.borrowButton, styles.borrowButtonInactive]}>
          <Text style={styles.buttonText}>Request</Text>
        </View>
      );
    }
  } else if (book.toReturn === true) {
    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => setReturnModalVisible(true)}>
          <Text style={styles.buttonText}>Return</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.extendButton}
          onPress={() => setExtendModalVisible(true)}>
          <Text style={styles.buttonText}>Extend</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (book.toReturn === false) {
    return (
      <View style={styles.returnedLabel}>
        <Text style={styles.labelText}>Returned</Text>
      </View>
    );
  }
};

  

  const handleDaySelection = days => {
    if (days >= 1 && days <= 30) {
      setSelectedDays(days);
    }
  };

  const handleReturnBook = async () => {
    try {
      const response = await axiosInstance.post('/books/return-book', {
        copyBookId: book.copyID,
      });
      console.log('Book returned successfully.');
      console.log(response.data); // Handle the response if needed
      onBookBorrowed(); // Trigger re-fetch of books in Category component
    } catch (error) {
      console.error('Error returning the book:', error);
      // Optionally handle the error, e.g., show an alert
    } finally {
      setReturnModalVisible(false);
    }
  };

  const handleConfirmBorrow = async () => {
    try {
      const response = await axiosInstance.post('/books/request-borrow', {
        bookId: book._id,
        daysToBorrow: selectedDays,
      });
      console.log(`borrow request for ${selectedDays} days.`);
      console.log(response.data); // Handle the response if needed
      setModalVisible(false);
      onBookBorrowed(); // Trigger re-fetch of books in Category component
    } catch (error) {
      console.error('Error borrowing the book:', error);
      // Optionally handle the error, e.g., show an alert
    }
  };

  const handleExtendBorrow = async () => {
    try {
      const response = await axiosInstance.post('/books/extend-borrow', {
        borrowId: book.borrowID, // Ensure borrowID is passed from props
        additionalDays: selectedDays,
      });
      console.log('Borrow period extended successfully.');
      console.log(response.data); // Handle the response if needed
      setExtendModalVisible(false);
      onBookBorrowed(); // Trigger re-fetch of books in Category component
    } catch (error) {
      console.error('Error extending borrow period:', error);
      // Optionally handle the error, e.g., show an alert
    }
  };

  return (


    <TouchableOpacity onPress={() => navigation.push('IndividualBook', {book})}>
      <View style={styles.bookContainer}>
        <View>
          <Image
            source={{uri: book.coverImage}}
            style={[
              styles.bookCover,
              book.toReturn === false || book.canBeBorrowed === false
                ? styles.dimmedImage
                : null,
            ]}
          />
        </View>
        <View style={styles.description}>
          <Text style={{color: 'white', fontSize: 20}}>{book.title}</Text>
          <Text style={{fontSize: 15}}>{book.author}</Text>
          <Text style={{fontSize: 15, marginTop: 30}}>
            Rating: {book.totalRating}
          </Text>
          <Text style={{fontSize: 15, marginTop: 10}}>
            Page Count: {book.pageCount}
          </Text>
        </View>
        <View style={styles.buttonContainer}>{renderButtons()}</View>

        {/* Modal for selecting days to borrow */}
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

        {/* Modal for confirming return */}
        <Modal
          transparent={true}
          visible={returnModalVisible}
          animationType="slide"
          onRequestClose={() => setReturnModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setReturnModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Confirm Return</Text>
                  <Text style={styles.modalText}>
                    Are you sure you want to return this book?
                  </Text>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleReturnBook}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal for extending borrow period */}
        <Modal
          transparent={true}
          visible={extendModalVisible}
          animationType="slide"
          onRequestClose={() => setExtendModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setExtendModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Extend Borrow</Text>
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
                    onPress={handleExtendBorrow}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  dimmedImage: {
    opacity: 0.5,
  },
  description: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'column',
  },
  borrowButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borrowButtonActive: {
    backgroundColor: '#4e4890',
  },
  borrowButtonInactive: {
    backgroundColor: 'gray',
  },
  returnButton: {
    backgroundColor: '#0083ce',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extendButton: {
    backgroundColor: '#234d6f',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnedLabel: {
    backgroundColor: '#888',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  labelText: {
    color: 'white',
    fontSize: 16,
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
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  requestButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonActive: {
    backgroundColor: '#4e4890', // Similar to the borrowButtonActive style
  },
});
