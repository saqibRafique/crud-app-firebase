import { Injectable } from '@angular/core';
import { 
  CollectionReference, 
  DocumentData, 
  DocumentReference, 
  Firestore, 
  addDoc, 
  collection, 
  collectionData, 
  deleteDoc, 
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private collectionInstance: CollectionReference<DocumentData, DocumentData>;

  constructor(private firestore: Firestore) {
    this.collectionInstance = collection(this.firestore, 'users');
  }

  addUser(data: any): Promise<DocumentReference<any, DocumentData>> {
    return addDoc(this.collectionInstance, data);
  }

  getUsers(): Observable<DocumentData[]> {
    return collectionData(this.collectionInstance, { idField: 'id' });
  }

  updateUser(id: string, data: any): Promise<void> {
    const docInstance = doc(this.firestore, 'users', id);
    return updateDoc(docInstance, data);
  }
  
  deleteUser(id: string): Promise<void> {
    const docInstance = doc(this.firestore, 'users', id);
    return deleteDoc(docInstance);
  }
}
