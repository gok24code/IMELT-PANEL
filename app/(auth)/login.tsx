import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Title, Paragraph, useTheme } from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Giriş Hatası', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      if (username === 'Ahmet Ali Süzen' && password === 'Isubu32') {
        // Pass only the teacher's name to the simplified signIn function
        await signIn('Ahmet Ali Süzen');
        router.replace('/'); // Redirect to home page
      } else {
        Alert.alert('Giriş Başarısız', 'Kullanıcı adı veya şifre yanlış.');
      }
    } catch (error) {
      console.error('Local login error:', error);
      Alert.alert('Hata', 'Giriş sırasında bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Title style={styles.title}>Öğretmen Girişi</Title>
        <Paragraph style={styles.subtitle}>Devam etmek için giriş yapın</Paragraph>

        <TextInput
          label="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Giriş Yap
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: theme.colors.placeholder,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
