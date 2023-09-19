// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

import firebase from 'react-native-firebase';
import * as js_firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APPLICATION_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APPLICATION_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

if (js_firebase.default.apps.length === 0) {
  js_firebase.default.initializeApp(firebaseConfig);
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ cacheSizeBytes: 25 * 1000000 });
  firebase.firestore().settings({ experimentalForceLongPolling: true });
} else {
  firebase.initializeApp(firebaseConfig, 'SERVICES.SLY');
}

if (__DEV__) {
  firebase.firestore().useEmulator('localhost', 8081);
}

const FIRESTORE = firebase.firestore();
const STORAGE = js_firebase.default.storage();

const FIRESTORE_COLLECTIONS = {
  CALLS: 'calls',
};

const STORAGE_DIRECTORIES = {
  PRESCRIPTIONS: 'prescriptions',
  RECORDS: 'records',
  REPORTS: 'reports',
  TEST_RESULTS: 'testResults',
  BIOLOGY: 'biology',
  RADIOLOGY: 'radiology',
  TREATMENTS: 'treatments',
  VACCINATIONS: 'vaccinations',
};

export {
  firebase,
  FIRESTORE,
  STORAGE,
  FIRESTORE_COLLECTIONS,
  STORAGE_DIRECTORIES,
};
