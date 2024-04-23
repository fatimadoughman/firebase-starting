import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

export const appConfig: ApplicationConfig = {

  providers: [importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"fir-satrting","appId":"1:662767041128:web:3f9544db4cea11933419dd","storageBucket":"fir-satrting.appspot.com","apiKey":"AIzaSyC9GWF7C-RJurwktrJvuqDAiMTWUOqgwmE","authDomain":"fir-satrting.firebaseapp.com","messagingSenderId":"662767041128","measurementId":"G-QS9CHWWT3X"}))), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideDatabase(() => getDatabase())), importProvidersFrom(provideFunctions(() => getFunctions())), importProvidersFrom(provideStorage(() => getStorage())), importProvidersFrom(provideRemoteConfig(() => getRemoteConfig()))]
};

