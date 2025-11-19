import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as Notifications from 'expo-notifications';
import Login from './src/screens/Login.js';
import SignUp from './src/screens/SignUp.js';
import Card from './src/screens/Card.js';
import HomeScreen from './src/screens/HomeScreen.js';
import Recarga from './src/screens/Recarga.js';
import Historico from './src/screens/Historico.js';
import Nfc from './src/screens/NFC.js';
import { configurarListenerNotificacoes, configurarListenerRespostaNotificacao } from './src/services/notificationsService';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular
  });

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current = configurarListenerNotificacoes((notification) => {
      console.log('Notificação recebida no app:', notification);
    });

    responseListener.current = configurarListenerRespostaNotificacao((response) => {
      console.log('Usuário interagiu com a notificação:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="Card" component={Card} options={{ headerShown: false }} />
        <Stack.Screen name="Recarga" component={Recarga}  options={{ headerShown: false }}/>
        <Stack.Screen name="Historico" component={Historico} options={{ headerShown: false }} />
        <Stack.Screen name="NFC" component={Nfc} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
