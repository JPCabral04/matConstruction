import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  orderByName: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';


  toogleOrder(type: 'name' | 'date') {
    if (type === 'name') {
      this.orderByName = this.orderByName === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
    }
  }
}
