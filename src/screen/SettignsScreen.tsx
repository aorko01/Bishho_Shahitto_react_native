import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function SettignsScreen() {
  return (
    <View style={styles.container}>
      <Text>SettignsScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1b2b',
        justifyContent: 'center',
        alignItems: 'center',
      },
})