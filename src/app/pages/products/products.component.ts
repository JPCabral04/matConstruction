import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  products: IProduct[] = [];
  orderByName: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';

  constructor(private db: DatabaseService) { };

  ngOnInit(): void {
    this.db.getCollection<IProduct>('products').subscribe(products => {
      if (products) {
        this.products = products;
      }
    })
  }

  toogleOrder(type: 'name' | 'date') {
    if (type === 'name') {
      this.orderByName = this.orderByName === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
    }
  }
}
