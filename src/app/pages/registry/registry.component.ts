import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { IStockRelease } from '../../shared/interfaces/stock-release.interface';
import { IStock } from '../../shared/interfaces/stock.interface';
import { IProduct } from '../../shared/interfaces/product.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUser } from '../../shared/interfaces/user.interface';

interface ProductCache {
  nome: string;
  imagemUrl: string;
}
interface UserCache {
  email: string;
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
  userCache = new Map<string, UserCache>();
  productCache = new Map<string, ProductCache>();

  orderByName: 'asc' | 'desc' = 'asc';
  orderByDate: 'asc' | 'desc' = 'asc';

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.getReleases();
  }

  getReleases() {
    this.db.getCollection<IStockRelease>('baixas').subscribe((releases) => {
      if (releases) {
        this.releases = releases;
        this.buildStockCache();
        this.buildUserCache();
      }
    });
  }

  toogleOrder(type: 'name' | 'date') {

    if (type === 'name') {
      this.orderByName = this.orderByName === 'asc' ? 'desc' : 'asc';
      this.sortReleaseByEmail();
    } else {
      this.orderByDate = this.orderByDate === 'asc' ? 'desc' : 'asc';
      this.sortReleasesByDate();
    }
  }

  sortReleaseByEmail() {
    let sortedReleases: IStockRelease[];

    if (this.orderByName === 'asc') {
      sortedReleases = [...this.releases].sort((a, b) => {
        const emailA = this.userCache.get(a.idBaixa ?? '')?.email || '';
        const emailB = this.userCache.get(b.idBaixa ?? '')?.email || '';
        return emailA.localeCompare(emailB);
      });
    } else {
      sortedReleases = [...this.releases].sort((a, b) => {
        const emailA = this.userCache.get(a.idBaixa ?? '')?.email || '';
        const emailB = this.userCache.get(b.idBaixa ?? '')?.email || '';
        return emailB.localeCompare(emailA);
      });
    }
    this.releases = sortedReleases;
  }

  sortReleasesByDate() {
    let sortedReleases: IStockRelease[];

    sortedReleases = [...this.releases].sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();

      return this.orderByDate === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

    this.releases = sortedReleases;
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

  getUserById(id: string): Observable<IUser | undefined> {
    return this.db.getDocument<IUser>('users', id);
  }

  buildUserCache() {
    this.userCache.clear();
    this.releases.forEach((item) => {
      if (item.idBaixa) {
        this.getUserById(item.idUsuario).subscribe((user) => {
          if (item.idBaixa && user) {
            this.userCache.set(item.idBaixa, { email: user.email ?? '', imagemUrl: user.imagemUrl ?? '' });
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


