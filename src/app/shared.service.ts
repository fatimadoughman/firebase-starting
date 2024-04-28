// shared.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, addDoc, getDoc } from '@angular/fire/firestore';
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
        });
      })

    });
  }

  deleteNoteWithImage(noteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const noteRef = doc(this.fs, 'notes', noteId);
      getDoc(noteRef).then((docSnapshot) => {
        if (!docSnapshot.exists()) {
          return;
        }
        const imagePath = docSnapshot.data()['imagePath'];
        if (!imagePath) {
          return;
        }
        const storageRef = ref(this.storage, imagePath);
        deleteObject(storageRef)
          .then(() => {
            deleteDoc(noteRef)
              .then(() => {
                resolve();
              })
          })
      })
    });
  }

  updateNoteWithImage(noteId: string, updatedContent: string, updatedImageFile: File | undefined): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const noteRef = doc(this.fs, 'notes', noteId);
      getDoc(noteRef).then((docSnapshot) => {
        if (!docSnapshot.exists()) {
          return;
        }
        const oldImagePath = docSnapshot.data()['imagePath'];
        if (updatedImageFile) {
          const storageRef = ref(this.storage, `images/${updatedImageFile.name}`);
          uploadBytes(storageRef, updatedImageFile).then(() => {
            getDownloadURL(storageRef).then((downloadURL) => {
              updateDoc(noteRef, {
                content: updatedContent,
                imagePath: downloadURL
              }).then(() => {
                resolve();
                if (oldImagePath) {
                  const oldImageRef = ref(this.storage, oldImagePath);
                  deleteObject(oldImageRef).catch((error) => {
                  });
                }
              })
            });
          })
        } else {
          updateDoc(noteRef, {
            content: updatedContent
          }).then(() => {
            resolve();
          })
        }
      })
    });
  }


}
