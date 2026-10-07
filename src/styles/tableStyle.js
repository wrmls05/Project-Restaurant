// src/styles/tableStyle.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- โทนสีสำหรับ Theme ---
  containerLight: { backgroundColor: '#FFFFFF' },
  containerDark: { backgroundColor: '#121212' }, // สีพื้นหลังโหมดมืด
  textLight: { color: '#09090B' },
  textDark: { color: '#FFFFFF' },
  subTextLight: { color: '#71717A' },
  subTextDark: { color: '#A1A1AA' },
  
  tableCardLight: { backgroundColor: '#F8F9FA', borderColor: '#F1F5F9' },
  tableCardDark: { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }, // สีการ์ดโหมดมืด

  // รูปแบบพื้นหลังรูปที่ "กลืนไปกับรูป" (ให้เป็น transparent หรือสีใกล้เคียง)
  imageContainerLight: { backgroundColor: 'transparent' }, 
  imageContainerDark: { backgroundColor: 'transparent' },

  // -------------------------

  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  iconCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneWrapper: {
    marginBottom: 16,
  },
  zonePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    marginRight: 8,
  },
  zonePillActive: {
    backgroundColor: '#18181B',
  },
  zoneText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
  zoneTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tableCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  tableImage: {
    width: '80%',
    height: '80%',
  },
  tableName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusBadge: {
    width: '100%',
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeAvailable: {
    backgroundColor: '#DCFCE7',
  },
  badgeOccupied: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#16A34A',
  },
  statusTextOccupied: {
    color: '#DC2626',
  },
  backButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});