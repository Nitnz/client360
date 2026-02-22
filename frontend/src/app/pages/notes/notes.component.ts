import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  providers: [DatePipe]
})
export class NotesComponent implements OnInit {

  projectId = ''; // 🔴 paste project id here for testing
  notes: any[] = [];
  noteText = '';
  loading = false;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    // 👉 For testing, paste one projectId here
    // this.projectId = 'PUT_PROJECT_ID_HERE';
    // this.loadNotes();
  }

  // 📥 Load notes
  loadNotes() {
    if (!this.projectId) return;

    this.loading = true;
    this.notesService.getNotesByProject(this.projectId).subscribe({
      next: (res) => {
        this.notes = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // ➕ Add note
  addNote() {
    if (!this.noteText || !this.projectId) return;

    const payload = {
      projectId: this.projectId,
      note: this.noteText
    };

    this.notesService.addNote(payload).subscribe({
      next: () => {
        this.noteText = '';
        this.loadNotes();
      }
    });
  }
}