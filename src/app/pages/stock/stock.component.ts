import { Component, OnInit } from '@angular/core';
import { IStock } from '../../shared/interfaces/stock.interface';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {

  stockItems: IStock[] = [];

  constructor(private db: DatabaseService) { };

  ngOnInit(): void {
    this.db.getCollection<IStock>('estoques').subscribe(items => {
      if (items) {
        this.stockItems = items;
      }
    })
  }

}
