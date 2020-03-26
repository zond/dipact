importScripts("https://dipact.appspot.com/static/firebase-app.js");
importScripts("https://dipact.appspot.com/static/firebase-messaging.js");

let firebaseConfig = {
	apiKey: "AIzaSyDxQpMuCYlu95_oG7FUCLFIYIIfvKz-4D8",
	authDomain: "diplicity-engine.firebaseapp.com",
	databaseURL: "https://diplicity-engine.firebaseio.com",
	projectId: "diplicity-engine",
	storageBucket: "diplicity-engine.appspot.com",
	messagingSenderId: "635122585664",
	appId: "1:635122585664:web:f87b8d8bd9023019a74fa5"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
