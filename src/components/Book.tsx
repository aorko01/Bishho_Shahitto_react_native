import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Book({ book }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);

  const renderButtons = () => {
    if (book.toReturn === undefined) {
      if (book.canBeBorrowed) {
        return (
          <TouchableOpacity
            style={[styles.borrowButton, styles.borrowButtonActive]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Borrow</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={[styles.borrowButton, styles.borrowButtonInactive]}>
            <Text style={styles.buttonText}>Borrow</Text>
          </View>
        );
      }
    } else if (book.toReturn === true) {
      return (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.returnButton}>
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extendButton}>
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

  const handleDaySelection = (days) => {
    setSelectedDays(days);
  };

  const handleConfirmBorrow = () => {
    // Handle the borrow action here, e.g., make an API call with selectedDays
    setModalVisible(false);
    console.log(`Book borrowed for ${selectedDays} days.`);
  };

  return (
    <TouchableOpacity onPress={() => navigation.push('IndividualBook', { book })}>
      <View style={styles.bookContainer}>
        <View>
          <Image
            source={{ uri: book.coverImage }}
            style={[
              styles.bookCover,
              (book.toReturn === false || book.canBeBorrowed === false) ? styles.dimmedImage : null,
            ]}
          />
        </View>
        <View style={styles.description}>
          <Text style={{ color: 'white', fontSize: 20 }}>{book.title}</Text>
          <Text style={{ fontSize: 15 }}>{book.author}</Text>
          <Text style={{ fontSize: 15, marginTop: 30 }}>
            Rating: {book.totalRating}
          </Text>
          <Text style={{ fontSize: 15, marginTop: 10 }}>
            Page Count: {book.pageCount}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {renderButtons()}
        </View>

        {/* Modal for selecting days */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Days</Text>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays === day && styles.dayButtonSelected,
                    ]}
                    onPress={() => handleDaySelection(day)}
                  >
                    <Text style={styles.dayText}>{day} {day === 1 ? 'day' : 'days'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmBorrow}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  modalContainer: {
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
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#3a3c51',
  },
  dayButtonSelected: {
    backgroundColor: '#4e4890',
  },
  dayText: {
    color: 'white',
    fontSize: 16,
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
});
