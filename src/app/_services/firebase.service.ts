import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getAvatars(){
      return this.db.collection('/avatar').valueChanges()
  }

  getMeterDetailCollection() {
    return this.db.firestore.collection('meterDetails');
  }

  getInvoiceCollection() {
    return this.db.firestore.collection('invoices');
  }

  getBatch() {
    return this.db.firestore.batch();
  }

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  async getMeterDerails(condn){
    // return this.db.collection('meterDetails').doc(userKey).snapshotChanges();
    return this.db.collection('meterDetails').snapshotChanges();
    
  }

  updateUser(userKey, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }

  getUsers(){
    return this.db.collection('users').snapshotChanges();
  }

  searchUsers(searchValue){
    return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }

  searchUsersByAge(value){
    return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }


  createUser(value){
    return this.db.collection('meterDetails').add({
      name: "demo1",
      nameToSearch: "demo1",
      surname: "value.surname"
    });
  }
  async insertData(value,table){
    return this.db.collection(table).add(value);
  }
}
