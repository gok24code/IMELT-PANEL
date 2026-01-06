// api.ts
import { Platform } from 'react-native';

// Use environment variables to define the API URLs.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const ANDROID_API_URL = process.env.EXPO_PUBLIC_ANDROID_API_URL || 'http://192.168.3.53:3000';

let API_URL = API_BASE_URL;

if (Platform.OS === 'android') {
  API_URL = ANDROID_API_URL;
}

console.log("Using API_URL:", API_URL);

export { API_URL };

