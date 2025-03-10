import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IStock } from '../../interfaces/stock.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '../../interfaces/product.interface';
import { DatabaseService } from '../../services/database.service';
import { IUser } from '../../interfaces/user.interface';

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

  editingUserName?: string;

  editForm = new FormGroup({
    product: new FormControl(''),
    lote: new FormControl(0),
    quantity: new FormControl(0),
    date: new FormControl('')
  });

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.getProducts();
    this.getStockItems();
    this.getCurrentStockProduct();
    this.getEditingUserEmail();

    if (this.stockItem) {
      this.editForm.patchValue({
        product: this.stockItem.idProduto,
        lote: this.stockItem.lote,
        quantity: this.stockItem.quantidade,
        date: this.stockItem.dataValidade
          ? new Date(this.stockItem.dataValidade).toISOString().split("T")[0]
          : "",
      });
    }
  }

  getProducts() {
    this.db.getCollection<IProduct>('products').subscribe(products => {
      if (products) {
        this.products = products;
      }
    });
  }

  getCurrentStockProduct() {
    if (this.stockItem) {
      this.db.getDocument<IProduct>('products', this.stockItem.idProduto).subscribe(product => {
        if (product) {
          this.stockItemProduct = product;
        }
      });
    }
  }

  getStockItems() {
    this.db.getCollection<IStock>('estoques').subscribe(items => {
      if (items) {
        this.stockItems = items;
      }
    });
  }

  getEditingUserEmail() {
    if (this.stockItem?.idUsuarioEditou) {
      this.db.getDocument<IUser>('users', this.stockItem?.idUsuarioEditou).subscribe(user => {
        if (user) {
          this.editingUserName = user.email;
        }
      })
    }
  }


  closeModal() {
    this.modalState.emit(false);
  }

  onSubmit() {
    if (this.stockItem?.id) {
      const formData = {
        idProduto: this.editForm.get('product')?.value || undefined,
        lote: Number(this.editForm.get('lote')?.value),
        quantidade: Number(this.editForm.get('quantity')?.value),
        dataValidade: this.formatDateToISO(this.editForm.get('date')?.value)
      };

      console.log(formData.idProduto);


      const updatedStockItem: Partial<IStock> = {
        ...this.stockItem,
        ...formData,
        dataUltimaEdicao: this.getCurrentDateISO()
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

  private formatDateToISO(dateString: string | null | undefined): string | undefined {
    if (!dateString) return undefined;
    return `${dateString}T00:00:00.000`;
  }

  private getCurrentDateISO(): string {
    const today = new Date();
    return today.toISOString();
  }

}