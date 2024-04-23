import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fs: Firestore) { }

  getNotes() {
    const notesCollection = collection(this.fs, 'notes');
    return collectionData(notesCollection, { idField: 'id' });
  }

  addNote(content: string) {
    const notesCollection = collection(this.fs, 'notes');
    return addDoc(notesCollection, { content: content });
  }
  
  deleteNote(noteId: string) {
    const noteDoc = doc(this.fs, 'notes', noteId);
    return deleteDoc(noteDoc);
  }
}
