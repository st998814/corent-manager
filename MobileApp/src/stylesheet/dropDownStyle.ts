import { StyleSheet } from 'react-native';


export const createDropDownMenu = (isDarkMode: boolean) =>{
    return StyleSheet.create({
      container: {
        position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ddd',
    borderRadius: 8,
    minHeight: 48,
  },
  buttonSelected: {
    borderColor: isDarkMode ? '#007AFF' : '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
    borderColor: isDarkMode ? '#444' : '#e0e0e0',
  },
  buttonText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    flex: 1,
  },
  buttonTextDisabled: {
    color: isDarkMode ? '#666' : '#999',
  },
  placeholderText: {
    color: isDarkMode ? '#888' : '#999',
  },
  arrow: {
    fontSize: 12,
    color:  isDarkMode ? '#999' : '#666',
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
    backgroundColor:  isDarkMode ? '#333' : '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor:  isDarkMode ? '#444' : '#ddd',
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
    borderBottomColor:  isDarkMode ? '#444' : '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  selectedItem: {
    backgroundColor: isDarkMode ? '#3A3A3A' : '#f0f8ff',
  },
  itemIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color:  isDarkMode ? '#fff' : '#000',
    flex: 1,
  },
  selectedItemText: {
    color:  isDarkMode ? '#007AFF' : '#007AFF',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 16,
    color:  isDarkMode ? '#007AFF' : '#007AFF',
    fontWeight: 'bold',
  },





    })






}