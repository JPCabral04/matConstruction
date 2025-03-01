import { Component } from '@angular/core';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  products = [
    { code: 'P001', name: 'Martelo', category: 'Ferramentas', quantity: 15 },
    { code: 'P002', name: 'Cimento 50kg', category: 'Materiais', quantity: 50 },
    { code: 'P003', name: 'Tinta Branca 3.6L', category: 'Tintas', quantity: 20 },
    { code: 'P004', name: 'Serra Circular', category: 'Ferramentas', quantity: 8 },
    { code: 'P005', name: 'Chave de Fenda', category: 'Ferramentas', quantity: 25 },
  ];
}
