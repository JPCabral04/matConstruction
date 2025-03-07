import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IStock } from '../../interfaces/stock.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent implements OnInit {
  @Input() stockItem?: IStock;
  @Output() modalState = new EventEmitter<boolean>();

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    console.log(this.stockItem);

  }

  closeModal() {
    this.modalState.emit(false);
  }
}
