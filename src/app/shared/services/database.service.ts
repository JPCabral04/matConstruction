import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  addDocument<T>(collection: string, data: T): Promise<any> {
    return this.db.collection<T>(collection).add(data);
  }

  getDocument<T>(collection: string, id: string): Observable<T | undefined> {
    return this.db.collection<T>(collection).doc(id).valueChanges();
  }

  getCollection<T>(collection: string): Observable<T[]> {
    return this.db.collection<T>(collection).valueChanges({ idField: 'id' }) as Observable<T[]>;
  }

  getCollectionWithFilter<T>(collection: string, field: keyof T, value: any): Observable<T[]> {
    return this.db.collection<T>(collection, ref => ref.where(field as string, '==', value)).valueChanges({ idField: 'id' }) as Observable<T[]>;
  }

  updateDocument<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    return this.db.collection<T>(collection).doc(id).update(data);
  }

  deleteDocument<T>(collection: string, id: string): Promise<void> {
    return this.db.collection<T>(collection).doc(id).delete();
  }
}
