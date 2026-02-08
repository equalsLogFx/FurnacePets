import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ShopModalProps {
  visible: boolean;
  items: ShopItem[];
  currency: number;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
}

export const ShopModal = ({ visible, items, currency, onClose, onBuy }: ShopModalProps) => {
  const [show, setShow] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => setShow(false));
    }
  }, [visible]);

  const GridItem: React.FC<{ item: ShopItem }> = ({ item }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    const handlePress = () => onBuy(item);

    return (
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={handlePress} style={styles.itemWrapper}>
        <Animated.View style={[styles.item, { transform: [{ scale }] }]}> 
          <View style={styles.thumb} />
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price} 🔥</Text>
        </Animated.View>
      </Pressable>
    );
  };

  if (!show) return null;

  return (
    <Modal visible={show} transparent>
      <Animated.View style={[styles.overlay, { opacity }]}> 
        <SafeAreaView style={styles.safeAreaInner}>
          <Animated.View style={[styles.panel, { opacity }]}> 
            <View style={styles.headerRow}>
              <Text style={styles.title}>Shop</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <FlatList
              data={items}
              keyExtractor={(i) => i.id}
              numColumns={3}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => <GridItem item={item} />}
            />
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    maxHeight: '70%',
    padding: 12,
    margin: 0,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 8 },
  closeText: { color: '#007aff' },
  grid: { paddingBottom: 24 },
  safeAreaInner: { flex: 1, justifyContent: 'flex-end' },
  itemWrapper: { flex: 1, margin: 6 },
  item: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 6,
  },
  thumb: {
    width: 64,
    height: 64,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 6,
  },
  itemName: { fontSize: 12, fontWeight: '600' },
  itemPrice: { fontSize: 12, color: '#666' },
});

export default ShopModal;
