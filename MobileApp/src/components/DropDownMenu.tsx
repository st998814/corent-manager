import React, { use, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';





export interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
}

interface SimpleDropdownProps {
  items: DropdownItem[];
  selectedValue?: any;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

export default function SimpleDropdown({
  items,
  selectedValue,
  onSelect,
  placeholder = "請選擇",
  disabled = false,
  style
}: SimpleDropdownProps) {


  const [visible, setVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;
  const {isDarkMode}=useTheme();

  const openDropdown = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const closeDropdown = () => {
    setVisible(false);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    closeDropdown();
  };

  const onLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDropdownLayout({ x, y, width, height });
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled && styles.buttonDisabled,
          selectedItem && styles.buttonSelected
        ]}
        onPress={openDropdown}
        disabled={disabled}
        onLayout={onLayout}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
          !selectedItem && styles.placeholderText
        ]}>
          {displayText}
        </Text>
        <Text style={[styles.arrow, visible && styles.arrowUp]}>
          {visible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable style={styles.overlay} onPress={closeDropdown}>
          <View style={[
            styles.dropdown,
            {
              top: dropdownLayout.y + dropdownLayout.height + 5,
              left: dropdownLayout.x,
              width: dropdownLayout.width,
            }
          ]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.item,
                    selectedValue === item.value && styles.selectedItem,
                    index === items.length - 1 && styles.lastItem
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.6}
                >
                  {item.icon && (
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                  )}
                  <Text style={[
                    styles.itemText,
                    selectedValue === item.value && styles.selectedItemText
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 48,
  },
  buttonSelected: {
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  buttonTextDisabled: {
    color: '#999',
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    maxHeight: 200,
  },
  scrollView: {
    maxHeight: 200,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  itemIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  selectedItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
