import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { IStockRelease } from '../../shared/interfaces/stock-release.interface';
import { IStock } from '../../shared/interfaces/stock.interface';
import { IProduct } from '../../shared/interfaces/product.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ProductCache {
  nome: string;
  imagemUrl: string;
}

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
})
export class RegistryComponent implements OnInit {
  releases: IStockRelease[] = [];
  stockCache = new Map<string, number>();
  productCache = new Map<string, ProductCache>();

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.getReleases();
  }

  getReleases() {
    this.db.getCollection<IStockRelease>('baixas').subscribe((releases) => {
      if (releases) {
        this.releases = releases;
        this.buildStockCache();
      }
    });
  }

  getStockLoteById(id: string, idBaixa: string): Observable<number> {
    return this.db.getDocument<IStock>('estoques', id).pipe(
      map((stock) => {
        const lote = stock?.lote ?? 0;
        if (stock?.idProduto) {
          this.buildProductCache(stock.idProduto, idBaixa);
        }
        return lote;
      }),
      catchError(() => of(0))
    );
  }

  buildStockCache() {
    this.stockCache.clear();
    this.releases.forEach((item) => {
      if (item.idBaixa) {
        this.getStockLoteById(item.idEstoque, item.idBaixa).subscribe((lote) => {
          if (item.idBaixa) {
            this.stockCache.set(item.idBaixa, lote);
          }
        });
      }
    });
  }

  buildProductCache(productId: string, baixaId: string) {
    if (!this.productCache.has(baixaId)) {
      this.getProductByStockId(productId).subscribe((product) => {
        if (product) {
          this.productCache.set(baixaId, { nome: product.nome ?? '', imagemUrl: product.imagemUrl ?? '' });
        }
      });
    }
  }

  getProductByStockId(id: string): Observable<IProduct | undefined> {
    return this.db.getDocument<IProduct>('products', id);
  }
}

