import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IStock } from '../../interfaces/stock.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '../../interfaces/product.interface';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent implements OnInit {
  @Input() stockItem?: IStock;
  @Output() modalState = new EventEmitter<boolean>();

  products?: IProduct[];
  stockItems?: IStock[];
  stockItemProduct?: IProduct;

  editForm = new FormGroup({
    product: new FormControl(''),
    lote: new FormControl(0),
    quantity: new FormControl(0),
  })

  constructor(private db: DatabaseService) { };

  ngOnInit() {
    this.getProducts();
    this.getStockItems();
    this.getCurrentStockProduct();

    if (this.stockItem) {
      this.editForm.patchValue({
        lote: this.stockItem.lote,
        quantity: this.stockItem.quantidade
      });
    }
  }

  getProducts() {
    this.db.getCollection<IProduct>('products').subscribe(products => {
      if (products) {
        this.products = products;
      }
    })
  }

  getCurrentStockProduct() {
    if (this.stockItem) {
      this.db.getDocument<IProduct>('products', this.stockItem.idProduto).subscribe(product => {
        if (product) {
          this.stockItemProduct = product;
        }
      })
    }
  }

  getStockItems() {
    this.db.getCollection<IStock>('estoques').subscribe(items => {
      if (items) {
        this.stockItems = items;
        console.log(this.stockItems);
      }
    })
  }

  closeModal() {
    this.modalState.emit(false);
  }

  onSubmit() {
    if (this.stockItem?.id) {
      const formData = {
        lote: Number(this.editForm.get('lote')?.value),
        quantidade: Number(this.editForm.get('quantity')?.value),
      }

      const updatedStockItem: Partial<IStock> = {
        ...this.stockItem,
        ...formData
      };

      this.db.updateDocument<IStock>('estoques', this.stockItem.id, updatedStockItem)
        .then(() => {
          console.log('Estoque atualizado');

        })
        .catch((error) => {
          console.log('Erro ao atualizar estoque', error);

        });
    }
    this.closeModal();
  }

}
