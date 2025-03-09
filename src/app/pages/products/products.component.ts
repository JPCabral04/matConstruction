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

  getProducts() {
    this.db.getCollection<IProduct>('products').subscribe(products => {
      if (products) {
        this.products = products;
        this.unfilteredProducts = products;
      }
    })
  }

  getProductType(): string[] {
    return Array.from(new Set(this.unfilteredProducts.map(item => item.tipo))).sort((a, b) => a.localeCompare(b) - b.localeCompare(a));
  }

  toogleOrder(type: 'name' | 'date') {
    this.cleanFilter();

    if (type === 'name') {
      this.orderByName = this.orderByName === 'asc' ? 'desc' : 'asc';
      this.sortProductsByName();
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
      this.sortProductsByDate();
    }
  }

  sortProductsByName() {

    let sortedProducts: IProduct[];

    if (this.orderByName === 'asc') {
      sortedProducts = [...this.products].sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      sortedProducts = [...this.products].sort((a, b) => b.nome.localeCompare(a.nome));
    }
    this.products = sortedProducts;
  }

  sortProductsByDate() {
    let sortedProducts: IProduct[];

    sortedProducts = [...this.products].sort((a, b) => {
      const dateA = new Date(a.dataUltimaEdicao).getTime();
      const dateB = new Date(b.dataUltimaEdicao).getTime();

      return this.orderByDate === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

    this.products = sortedProducts;
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
