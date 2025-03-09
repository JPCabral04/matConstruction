import { Component, OnInit } from '@angular/core';
import { IStock } from '../../shared/interfaces/stock.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/product.interface';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { IUser } from '../../shared/interfaces/user.interface';
interface ProductCache {
  nome: string;
  imagemUrl: string;
}
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {

  stockFilterForm = new FormGroup({
    lote: new FormControl(''),
    name: new FormControl(''),
    date: new FormControl(''),
  })

  stockItems: IStock[] = [];
  unfilteredStockItems: IStock[] = [];
  filteredStockItems: IStock[] = [];

  selectedItem?: IStock;

  orderByLote: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';

  modalIsOpen: boolean = false;

  productCache = new Map<string, ProductCache>();

  userType: string = 'leitor';

  constructor(private db: DatabaseService, private auth: AuthService) { };

  ngOnInit(): void {
    this.getStockItems();
    this.getUserType();
  }

  getStockItems() {
    this.db.getCollection<IStock>('estoques').subscribe(items => {
      if (items) {
        this.stockItems = items;
        this.unfilteredStockItems = [...items];
        this.buildStockCache();
      }
    });
  }

  getUserType() {
    this.auth.getUserData().subscribe((user: IUser) => {
      if (user) {
        this.userType = user.tipoUsuario;
      }
    })
  }

  getStockLote(): number[] {
    return Array.from(new Set(this.unfilteredStockItems.map(item => item.lote))).sort((a, b) => a - b);
  }

  toogleOrder(type: 'lote' | 'date') {
    this.cleanFilter();

    if (type === 'lote') {
      this.orderByLote = this.orderByLote === 'asc' ? 'desc' : 'asc';
      this.sortStockByLote();
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
      this.sortStockByDate();
    }
  }

  sortStockByLote() {

    let sortedStockItem: IStock[];

    if (this.orderByLote === 'asc') {
      sortedStockItem = [...this.stockItems].sort((a, b) => a.lote - b.lote);
    } else {
      sortedStockItem = [...this.stockItems].sort((a, b) => b.lote - a.lote);
    }
    this.stockItems = sortedStockItem;

  }

  sortStockByDate() {
    let sortedStockItem: IStock[];

    sortedStockItem = [...this.stockItems].sort((a, b) => {
      const dateA = new Date(a.dataUltimaEdicao).getTime();
      const dateB = new Date(b.dataUltimaEdicao).getTime();

      return this.orderByDate === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

    this.stockItems = sortedStockItem;
  }


  filterStockItems() {
    const name = this.stockFilterForm.get('name')?.value?.toLowerCase().trim();
    const lote = Number(this.stockFilterForm.get('lote')?.value as unknown);
    const date = this.stockFilterForm.get('date')?.value;


    this.filteredStockItems = this.unfilteredStockItems.filter(stockItem => {
      const matchesName = name ? this.productCache.get(stockItem.id ?? '')?.nome.toLowerCase().includes(name) : true;
      const matchesLote = lote ? stockItem.lote === lote : true;
      const matchesDate = date ? new Date(stockItem.dataCadastro).toISOString().split('T')[0] === date : true;

      return matchesName && matchesLote && matchesDate;
    });

    this.stockItems = [...this.filteredStockItems];
  }


  cleanFilter() {
    this.stockFilterForm.reset();
    this.stockItems = [...this.unfilteredStockItems];
  }

  actionModal(state: boolean, item?: IStock) {
    this.modalIsOpen = state;

    if (item) {
      this.selectedItem = item;
    }
  }

  getProductsById(id: string): Observable<IProduct | undefined> {
    return this.db.getDocument<IProduct>('products', id);
  }

  buildStockCache() {
    this.productCache.clear();
    this.stockItems.forEach((item) => {
      this.getProductsById(item.idProduto).subscribe((product) => {
        if (item.id && product) {
          this.productCache.set(item.id, { nome: product.nome ?? '', imagemUrl: product.imagemUrl ?? '' });
        }
      });
    });
  }

  obSubmit() {
    this.filterStockItems();
  }

}