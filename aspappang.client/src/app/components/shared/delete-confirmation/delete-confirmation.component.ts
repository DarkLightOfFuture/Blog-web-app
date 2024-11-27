import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {
  constructor(private dialogConfirmationRef: MatDialogRef<DeleteConfirmationComponent>) { }

  cancel() {
    this.dialogConfirmationRef.close();
  }

  confirm() {
    this.dialogConfirmationRef.close(true);
  }
}
