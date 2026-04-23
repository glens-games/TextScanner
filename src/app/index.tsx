import { Spacing } from '@/constants/theme';
import { ScanItem, useLocalStorage } from '@/data/localStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const {data} = useLocalStorage();

  const filteredItems = data.items.filter((item) =>
    item.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleItemPress = (id: string) => {
    router.push({ pathname: '/view/[id]', params: { id } });
  };

  const handleAddPress = () => {
    router.push('/camera');
  };

  const renderItem = ({ item }: { item: ScanItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.7}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemCoordinates}>
          Crop: ({item.cropCoordinates.x}, {item.cropCoordinates.y}) - 
          {item.cropCoordinates.width}x{item.cropCoordinates.height}
        </Text>
        <Text style={styles.itemText} numberOfLines={2}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Text Scanner</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}>
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter scans..."
          placeholderTextColor="#8E8E93"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addIconText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsButton: {
    padding: Spacing.half,
  },
  iconText: {
    fontSize: 24,
  },
  addIconText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    backgroundColor: '#F2F2F7',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: Spacing.four,
    fontSize: 17,
    color: '#000000',
    marginRight: Spacing.one,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.four,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.one,
    marginBottom: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.one,
    justifyContent: 'center',
  },
  itemCoordinates: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 15,
    color: '#000000',
  },
});
