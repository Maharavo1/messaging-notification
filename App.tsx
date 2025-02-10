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

