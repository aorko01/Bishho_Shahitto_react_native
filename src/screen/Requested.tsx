import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Requested() {
  return (
    <View style={styles.container}>
      <Text>Requested</Text>
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