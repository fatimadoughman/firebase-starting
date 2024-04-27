// shared.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fs: Firestore, private storage: Storage) {}

  getCombinedData(): Observable<any[]> {
    const notesCollection = collection(this.fs, 'notes');
    const imagesCollection = collection(this.fs, 'images');
    const notesData = collectionData(notesCollection, { idField: 'id' });
    const imagesData = collectionData(imagesCollection, { idField: 'id' });
    return combineLatest([notesData, imagesData]).pipe(
      map(([notes, images]) => {
        const notesWithType = notes.map((note: any) => ({ ...note, type: 'note' }));
        const imagesWithType = images.map((image: any) => ({ ...image, type: 'image' }));
        return [...notesWithType, ...imagesWithType];
      })
    );
  }

  addNoteWithImage(noteContent: string, imageFile: File): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        reject(new Error("No image file selected."));
        return;
      }

      const notesCollection = collection(this.fs, 'notes');
      const storageRef = ref(this.storage, `images/${imageFile.name}`);

      uploadBytes(storageRef, imageFile).then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          addDoc(notesCollection, { content: noteContent, imagePath: downloadURL, type: 'note' })
            .then((docRef) => {
              resolve({ id: docRef.id, content: noteContent, imagePath: downloadURL, type: 'note' });
            })
            .catch((error) => {
              reject(error);
            });
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  deleteNoteWithImage(noteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const noteRef = doc(this.fs, 'notes', noteId);
        deleteDoc(noteRef).then(() => {
          const imagePath = `images/${noteId}.png`;
          const storageRef = ref(this.storage, imagePath);
          deleteObject(storageRef).then(() => {
            console.log("Note and associated image deleted successfully.");
            resolve();
          }).catch((error) => {
            reject(error);
          });
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        console.error("Error deleting note or associated image:", error);
        reject(error);
      }
    });
  }

  updateNote(noteId: string, content: string): Promise<void> {
    console.log('Updating note:', noteId, 'with content:', content);
    const noteRef = doc(this.fs, 'notes', noteId);
    return updateDoc(noteRef, { content: content })
      .then(() => console.log('Note updated successfully!'))
      .catch(error => console.error('Error updating note:', error));
  }
}
