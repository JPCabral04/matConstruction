import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { IStockRelease } from '../../shared/interfaces/stock-release.interface';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { IStock } from '../../shared/interfaces/stock.interface';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
})
export class RegistryComponent implements OnInit {
  releases: IStockRelease[] = [];
  stockCache = new Map<string, number>();
  productCache = new Map<string, string>();

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

  getStockLoteById(id: string): Observable<number> {
    return this.db.getDocument<IStock>('estoques', id).pipe(
      map((stock) => stock?.lote ?? 0),
      catchError(() => of(0))
    );
  }

  buildStockCache() {
    this.stockCache.clear();

    this.releases.forEach((item) => {
      this.getStockLoteById(item.idEstoque).subscribe((lote) => {
        if (item.idBaixa) {
          this.stockCache.set(item.idBaixa, lote);
        }
      });
    });
  }

}
