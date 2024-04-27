
import { Component } from '@angular/core';
import { SharedService } from './shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true,
  imports:[FormsModule]
})
export class AppComponent {
  title = 'firebase-starting';
  uploadedImageName: string | undefined;
  selectedImageFile: File | undefined;
  notes: any[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.refreshNotes();
  }

  refreshNotes() {
    this.sharedService.getCombinedData().subscribe((res) => {
      this.notes = res;
    });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    this.uploadedImageName = file.name;
    this.selectedImageFile = file;
  }

  addNoteWithImage(newNote: string, selectedImageFile: File) {
    if (!newNote.trim() || !selectedImageFile) {
      return;
    }

    this.sharedService.addNoteWithImage(newNote, selectedImageFile).then((noteWithImage) => {
      this.notes.push(noteWithImage);
    });
  }

  deleteNoteWithImage(noteId: string): void {
    this.sharedService.deleteNoteWithImage(noteId)
      .then(() => {
        this.refreshNotes();
      })
      .catch(error => {
        console.error("Error deleting note with image:", error);
      });
  }

  filterText: string = '';
  toggleEditMode(item: any) {
    item.editMode = !item.editMode;
  }

  saveChanges(item: any) {
    this.sharedService.updateNote(item.id, item.content).then(() => {
      item.editMode = false;
    });
  }
}
