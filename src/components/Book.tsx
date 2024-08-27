import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

export default function Book({book, onBookBorrowed}) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [extendModalVisible, setExtendModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrPayload, setQrPayload] = useState('');

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken !== null) {
          setQrPayload(
            JSON.stringify({
              bookId: book._id,
              daysToBorrow: selectedDays,
              accessToken: accessToken,
            }),
          );
        }
      } catch (error) {
        console.error('Error getting accessToken:', error);
      }
    };

    getAccessToken();
  }, [selectedDays, book._id]);

  const renderButtons = () => {
    if (book.canBeBorrowed !== undefined) {
        if (book.canBeBorrowed) {
            return (
                <TouchableOpacity
                    style={[styles.borrowButton, styles.borrowButtonActive]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Request</Text>
                </TouchableOpacity>
            );
        } else {
            if (book.remind === true) {
                return (
                    <TouchableOpacity
                        style={[styles.borrowButton, styles.borrowButtonInactive, styles.remindButton]}
                        disabled={true} // Make the button non-clickable
                    >
                        <Text style={styles.buttonText}>Remind</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity
                        style={[styles.borrowButton, styles.borrowButtonInactive]}
                        onPress={() => {/* Handle remind functionality if needed */}}
                    >
                        <Text style={styles.buttonText}>Remind</Text>
                    </TouchableOpacity>
                );
            }
        }
    } else if (book.confirmBorrow === true) {
        return (
            <TouchableOpacity
                style={[styles.borrowButton]}
                onPress={() => setQrModalVisible(true)}>
                <Text style={styles.buttonText}>Borrow</Text>
            </TouchableOpacity>
        );
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
      console.log(`Borrow request for ${selectedDays} days.`);
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
              book.toReturn === false ||
              book.canBeBorrowed === false ||
              book.confirmBorrow === false
                ? styles.dimmedImage
                : null,
            ]}
          />
        </View>
        <View style={styles.description}>
          <Text style={{color: 'white', fontSize: 20}}>{book.title}</Text>
          <Text style={{fontSize: 15, color: '#565968'}}>{book.author}</Text>
          <Text style={{fontSize: 15, marginTop: 30, color: '#565968'}}>
            Rating: {book.totalRating}
          </Text>
          <Text style={{fontSize: 15, marginTop: 10, color: '#565968'}}>
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
                  <Text style={styles.modalText}>additional days</Text>
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

        {/* Modal for QR code */}
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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2b',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  dimmedImage: {
    opacity: 0.4,
  },
  description: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  borrowButton: {
    backgroundColor: '#e44243',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 5,
  },
  borrowButtonActive: {
    backgroundColor: '#4e4890',
  },
  borrowButtonInactive: {
    backgroundColor: '#fb8c00',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'column', // Arrange buttons vertically
    alignItems: 'center', // Center-align the buttons
  },
  returnButton: {
    backgroundColor: '#0083ce',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    width: '100%', // Make the button full width
    marginBottom: 20, // Space between the two buttons
  },
  extendButton: {
    backgroundColor: '#234d6f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%', // Make the button full width
  },
  remindButton: {
    backgroundColor: '#c0c0c0', // Ash color
    opacity: 0.6, // To show the button is non-clickable
},
  returnedLabel: {
    backgroundColor: '#757575',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  labelText: {
    color: 'white',
    fontSize: 16,
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
