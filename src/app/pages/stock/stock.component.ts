import { Component, OnInit } from '@angular/core';
import { IStock } from '../../shared/interfaces/stock.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {

  stockFilterForm = new FormGroup({
    lote: new FormControl(''),
    date: new FormControl(''),
    type: new FormControl(''),
  })

  stockItems: IStock[] = [];
  unfilteredStockItems: IStock[] = [];
  filteredStockItems: IStock[] = [];
  orderByLote: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';

  constructor(private db: DatabaseService) { };

  ngOnInit(): void {
    this.getStockItems();
  }

  getStockItems() {
    this.db.getCollection<IStock>('estoques').subscribe(items => {
      if (items) {
        this.stockItems = items;
      }
    })
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



  // filterStockItems() {
  //   const name = this.stockFilterForm.get('lote')?.value?.toLowerCase().trim();
  //   const date = this.stockFilterForm.get('date')?.value;
  //   const type = this.stockFilterForm.get('type')?.value;

  //   this.filteredStockItems = this.unfilteredStockItems.filter(stockItem => {
  //     const matchesName = name ? stockItem.nome?.toLowerCase().includes(name) : true;
  //     const matchesType = type ? stockItem.tipo === type : true;
  //     const matchesDate = date ? new Date(stockItem.dataCadastro).toISOString().split('T')[0] === date : true;

  //     return matchesName && matchesType && matchesDate;
  //   });

  //   this.stockItems = [...this.filteredStockItems];
  // }


  cleanFilter() {
    this.stockFilterForm.reset();
    this.stockItems = [...this.unfilteredStockItems];
  }



  obSubmit() {

  }

}