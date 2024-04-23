import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true,
})
export class AppComponent {

  title = 'firebase-starting';

  constructor(private sharedservice: SharedService) { }

  notes: any = [];
  refreshnotes() {
    this.sharedservice.getNotes().subscribe((res) => {
      this.notes = res;
    });
  }

  ngOnInit():void{
    this.refreshnotes();
  }


  addnotes(newnotes: string) {
    this.sharedservice.addNote(newnotes).then((res) => {
      this.refreshnotes();
    });
  }

  deleteNote(noteId: string) {
    this.sharedservice.deleteNote(noteId).then(() => {
      this.refreshnotes();
    });
  }
  }



