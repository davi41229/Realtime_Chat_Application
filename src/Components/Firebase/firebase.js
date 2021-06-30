import firebase from '@firebase/app';
require('@firebase/auth');
require('@firebase/firestore');
require('@firebase/storage');
var firebaseConfig = {
    apiKey: "AIzaSyBr6BZ5B9HrVFtELDpcHDGx7Cjrudl4O4k",
    authDomain: "realtime-web-chat-application.firebaseapp.com",
    projectId: "realtime-web-chat-application",
    storageBucket: "realtime-web-chat-application.appspot.com",
    messagingSenderId: "58523868673",
    appId: "1:58523868673:web:eb5b372736a9293f44ea00",
    measurementId: "G-LZ7ZHFM4NJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;