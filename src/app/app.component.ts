
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
  }
  toggleEditMode(note: any) {
    note.editMode = !note.editMode;
  }
  uploadNewImage(event: any, note: any) {
    const file = event.target.files[0];
    note.newImage = file;
  }
  saveChanges(note: any) {
    const { id, content, newImage } = note;
    this.sharedService.updateNoteWithImage(id, content, newImage).then(() => {
      note.editMode = false;
      note.content = content;
    });
  }




  searchText: string = ''; // Property to hold the search text

  // Function to filter notes based on search text
  filterNotes() {
    return this.notes.filter((note) => {
      return note.content.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
}
