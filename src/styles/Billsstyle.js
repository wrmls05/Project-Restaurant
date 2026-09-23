import { StyleSheet } from "react-native";
 
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    marginBottom: 25,
    paddingTop: 15,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    marginRight: 28,
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '400',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  tabUnderline: {
    marginTop: 6,
    height: 2,
    backgroundColor: '#000',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    height: 130,
    backgroundColor: '#dcdcdc',
    borderRadius: 6,
    marginBottom: 16,
  },
  bottomBar: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
})