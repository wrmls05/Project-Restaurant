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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    marginBottom: 16,
    paddingTop: 25,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    // Placeholder style เตรียมไว้สำหรับข้อมูลออเดอร์จริงที่จะเชื่อมเข้ามา
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