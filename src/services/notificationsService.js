import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { db } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registrarParaNotificacoesPush(userId) {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId,
    })).data;
    
    console.log('Token FCM:', token);
    
    if (userId && token) {
      await salvarTokenNoFirestore(userId, token);
    }
  } else {
    alert('Deve usar um dispositivo físico para receber notificações push!');
  }

  return token;
}

async function salvarTokenNoFirestore(userId, token) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      fcmToken: token,
      fcmTokenUpdatedAt: new Date(),
      plataforma: Platform.OS
    });
    console.log('Token salvo no Firestore');
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
}

export function configurarListenerNotificacoes(handleNotification) {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notificação recebida:', notification);
    if (handleNotification) {
      handleNotification(notification);
    }
  });

  return subscription;
}

export function configurarListenerRespostaNotificacao(handleResponse) {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Resposta da notificação:', response);
    if (handleResponse) {
      handleResponse(response);
    }
  });

  return subscription;
}

export async function enviarNotificacaoLocal(titulo, mensagem) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

export async function cancelarTodasNotificacoes() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

