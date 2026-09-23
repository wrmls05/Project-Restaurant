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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 350,
  },
  button: {
    flex: 1,
    backgroundColor: '#B0B0B0',
    borderRadius: 6,
    paddingVertical: 22,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 23,
    color: '#fff',
    fontWeight: '500',
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