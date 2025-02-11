/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {  useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { Linking, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Setting from './components/Setting';
//import './services/servcie'
import firebase from '@react-native-firebase/app';
import { getApp, initializeApp } from '@react-native-firebase/app';

const Stack = createStackNavigator();
const NAVIGATION_IDS = ["home", "settings"];
const app = getApp(); 

function buildDeepLinkFromNotificationData(data:any): string | null {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === "home") {
    


    return 'myapp://home';
  }
  if (navigationId === "settings") {
    return 'myapp://settings';
  }
  
  return null
}


const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: "home",
      Settings: "settings"
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }

    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);

    });
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url)
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
}
function App(): React.JSX.Element {
  useEffect(()=>{
   const requestUserPermission = async () => {
     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('FCM token:', token);
    }
  };

  requestUserPermission();
  },[])

 return (
   <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
   <Stack.Navigator initialRouteName='Home'>
     <Stack.Screen name="Home" component={Home} />
     <Stack.Screen name="Settings" component={Setting} />
   </Stack.Navigator>
 </NavigationContainer>
 );
}