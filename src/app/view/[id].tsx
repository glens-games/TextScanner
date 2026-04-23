import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useLocalStorage } from '@/data/localStorage';

export default function ViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {data} = useLocalStorage();

  const item = data.items.find((i) => i.id === id);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Scan</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.imageUri }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.coordinatesText}>
            Crop: ({item.cropCoordinates.x}, {item.cropCoordinates.y}) - 
            {item.cropCoordinates.width}x{item.cropCoordinates.height}
          </Text>
          <Text style={styles.scannedText}>{item.text}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Spacing.four,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: Spacing.one,
  },
  scannedText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
});