import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { IProduct } from '../../shared/interfaces/product.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  productFilterForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(''),
    type: new FormControl(''),
  })

  products: IProduct[] = [];
  unfilteredProducts: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  orderByName: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';

  constructor(private db: DatabaseService) { };

  ngOnInit(): void {
    this.getProducts();
  }


  toogleOrder(type: 'name' | 'date') {
    if (type === 'name') {
      this.orderByName = this.orderByName === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
    }
  }

  getProducts() {
    this.db.getCollection<IProduct>('products').subscribe(products => {
      if (products) {
        this.products = products;
        this.unfilteredProducts = products;
      }
    })
  }

  filterProducts() {
    const name = this.productFilterForm.get('name')?.value?.toLowerCase().trim();
    const date = this.productFilterForm.get('date')?.value;
    const type = this.productFilterForm.get('type')?.value;

    this.filteredProducts = this.unfilteredProducts.filter(product => {
      const matchesName = name ? product.nome?.toLowerCase().includes(name) : true;
      const matchesType = type ? product.tipo === type : true;
      const matchesDate = date ? new Date(product.dataCadastro).toISOString().split('T')[0] === date : true;

      return matchesName && matchesType && matchesDate;
    });

    this.products = [...this.filteredProducts];
  }


  cleanFilter() {
    this.productFilterForm.reset();
    this.products = [...this.unfilteredProducts];
  }



  obSubmit() {
    this.filterProducts();


  }
}
