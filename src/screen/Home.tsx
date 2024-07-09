import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const coverImages = [
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.notification}>
          <Icon name="notifications" size={30} color="white" />
        </View>
        <Image
          source={{
            uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTP9hneBUzKcWY0lZAnnIP9-rPOWqP9lsVIO5iihMwrKsTcevg2OehToQ3wb-1z3FNIWJ4nWEqdd5AunJjSCdwTFbWgAW5mFSxlRp56Og',
          }}
          style={styles.avatar}
        />
        <Text style={styles.Hello}>Hello Ali!</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Books"
          placeholderTextColor="#888"
        />

        {/* Section 1: Top Picks for you */}
        <View style={styles.sectionContainer1}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Top Picks for you</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={styles.bookCoverTrending}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 2: Trending */}
        <View style={styles.sectionContainer2}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={styles.bookCover}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 3: Pick from Popular Genre */}
        <View style={styles.sectionContainer3}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Pick from Popular Genre</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={styles.bookCover}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 4: Your recent Borrows */}
        <View style={styles.sectionContainer4}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Your recent Borrows</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={styles.bookCover}
              />
            ))}
          </ScrollView>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
  },
  sectionContainer1: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer2: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer3: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer4: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  TrendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  Hello: {
    color: 'white',
    fontSize: 24,
    marginLeft: 15,
    marginTop: 5,
  },
  Heading: {
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
  all: {
    color: '#888',
    fontSize: 16,
    marginTop: 5,
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 12,
  },
  avatar: {
    width: 65,
    height: 65,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    marginTop: 25,
    marginLeft: 15,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 125,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    backgroundColor: '#3a3c51',
  },
  horizontalScroll: {
    paddingLeft: 15,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 20,
  },
  bookCoverTrending: {
    width: 125,
    height: 190,
    borderRadius: 10,
    marginRight: 20,
  },
});
