import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()
export class UserService {

  usersCollection: AngularFirestoreCollection<any>;
  noteDocument:   AngularFirestoreDocument<any>;
  arrUsers;
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.usersCollection = this.firestore.collection('users');
    // this.arrUsers = this.firestore.collection('meterDetails').snapshotChanges();
  }

  

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    // return this.usersCollection.snapshotChanges();
    return this.firestore.collection('users').snapshotChanges();
  }

  getUser(id: string) {
    return this.firestore.doc<any>(`users/${id}`);
  }

  createUser(content) {

    return this.afAuth.auth
    .createUserWithEmailAndPassword(content.email, "Welcome123")
    .then(credential => {
      content['uid'] = credential.user.uid
      content['time'] = new Date().getTime();
      
      return this.usersCollection.add(content);
    }).catch(error => {
      console.log(error);
    });
  }

  updateUser(id: string, data: any) {
    return this.getUser(id).update(data);
  }

  deleteNote(id: string) {
    return this.getUser(id).delete();
  }
}