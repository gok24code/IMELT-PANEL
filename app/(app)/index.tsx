import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, ActivityIndicator, Modal, Portal, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import MapView, { Marker, MapStyleElement } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const customMapStyle: MapStyleElement[] = [
    // ... (map style remains the same)
];

interface Student {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export default function HomeScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { teacherName, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // In a local-only login setup, a token might not exist.
      // The backend should decide how to handle an empty token.
      // For now, we send it, and if it fails, the error is handled gracefully.
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        headers: { 'x-auth-token': token || '' },
      });

      if (!response.ok) {
        throw new Error('Sunucudan veri alınamadı.');
      }

      const data: Student[] = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Öğrenciler yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
      setStudents([]); // Ensure list is empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleStudentPress = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={`Hoş geldiniz, ${teacherName || 'Öğretmen'}!`} />
        <Appbar.Action icon="logout" onPress={signOut} />
      </Appbar.Header>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
            <Text style={styles.studentName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyListText}>
              Öğrenci Bulunamadı.
            </Text>
          </View>
        }
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedStudent && (
            <Card style={styles.studentCard}>
              <Card.Title title={selectedStudent.name} subtitle="Öğrenci Bilgileri" />
              <Card.Content>
                <Paragraph>Konum:</Paragraph>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    provider="google"
                    customMapStyle={customMapStyle}
                    initialRegion={{
                      latitude: selectedStudent.lat,
                      longitude: selectedStudent.lng,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    <Marker
                      coordinate={{ latitude: selectedStudent.lat, longitude: selectedStudent.lng }}
                      title={selectedStudent.name}
                    />
                  </MapView>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => setModalVisible(false)}>Kapat</Button>
              </Card.Actions>
            </Card>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  studentItem: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    color: theme.colors.text,
  },
  emptyListText: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  modalContainer: {
    padding: 20,
  },
  studentCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  mapContainer: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
