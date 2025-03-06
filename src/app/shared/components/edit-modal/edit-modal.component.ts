import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IStock } from '../../interfaces/stock.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent {
  @Input() stockItem?: IStock;
  @Output() modalState = new EventEmitter<boolean>();

  editForm = new FormGroup({

  })

  closeModal() {
    this.modalState.emit(true);
  }
}
