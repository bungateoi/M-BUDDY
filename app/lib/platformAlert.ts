import { Alert, Platform } from 'react-native';

// React Native Web's Alert.alert là NO-OP hoàn toàn (xem
// node_modules/react-native-web/src/exports/Alert/index.js — `static
// alert() {}`), nên trên web, Alert.alert không hiện gì cả VÀ không bao giờ
// gọi callback của các button — nếu dùng để gate 1 hành động bắt buộc (như
// điều hướng), nút bấm sẽ trông như bị hỏng hoàn toàn trên web. Hàm này
// dùng window.alert trên web (thật sự hiện được), Alert.alert trên native.
export function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}
