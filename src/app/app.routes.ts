
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedService } from './shared.service';

const firebaseConfig = {
  apiKey: "AIzaSyC9GWF7C-RJurwktrJvuqDAiMTWUOqgwmE",
  authDomain: "fir-satrting.firebaseapp.com",
  projectId: "fir-satrting",
  storageBucket: "fir-satrting.appspot.com",
  messagingSenderId: "662767041128",
  appId: "1:662767041128:web:3f9544db4cea11933419dd",
  measurementId: "G-QS9CHWWT3X"
};

@NgModule({
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers:[SharedService],
})
export class AppModule { }
