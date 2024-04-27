import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect} from 'react';


export default function App() {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() =>{
    if(requestUserPermission()){
      messaging().getToken().then((token) =>{
        console.log(token);  
      });
    }else{
      console.log("Permison no concedidos",authStatus);
    }
      //Cheker whether an initial notification is avilable
    messaging().getInitialNotification().then(async (remoteMessage) =>{
      if(remoteMessage){
        console.log("La notificacion causo que la app se saliera del estado", 
        remoteMessage.notification);
      }
    });
    // Asumir que la notificacion tiene prioridad
    messaging().onNotificationOpenedApp( (remoteMessage) =>{
      console.log("La notificacion causo que la app se abriera del estado inactivo"
      , remoteMessage.notification);
    });
    //Registrar manejo de inactividad
    messaging().setBackgroundMessageHandler( async (remoteMessage)=>{
      console.log("Mensaje en segundo plano", remoteMessage);
    });

    const unsubscribe = messaging().onMessage( async (remoteMessage) =>{
      Alert.alert("Un nuevo mensaje llego", JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, [] );




  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
