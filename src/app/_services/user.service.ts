import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from '../_models/index';

@Injectable()
export class UserService {

  usersCollection: AngularFirestoreCollection<any>;
  noteDocument: AngularFirestoreDocument<any>;
  arrUsers;
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth,
    private afAuth2: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.usersCollection = this.firestore.collection('users');
    // this.arrUsers = this.firestore.collection('meterDetails').snapshotChanges();
  }



  getAllUser() {
    // ['added', 'modified', 'removed']
    // return this.usersCollection.snapshotChanges();
    return this.firestore.collection('users').valueChanges();
  }

  getUserCondn(condn = null) {
    return this.firestore.collection('users', ref => ref.where(condn.key, '==', condn.value)).valueChanges()

  }

  getMeterDetails(date = null) {
    return this.firestore.collection('meterDetails', ref => ref.where("ReadingTimeTimestamp", '>=', date)).valueChanges();
    // const ref2 =  this.firestore.collection('meterDetails', ref => ref.where(condn.key, '==', condn.value));
    // var meterDetailsRef = this.firestore.collection('meterDetails');
    // meterDetailsRef.where("ReadingTime",">",)
    

  }

 


  // getUserByCondn(condn) {
  //   return this.firestore.collection('users').where("capital", "==", true).get();
  // }
  createUser(content) {

    return this.afAuth2.auth
      .createUserWithEmailAndPassword(content.email, "Welcome123")
      .then(credential => {
        content['uid'] = credential.user.uid
        content['time'] = new Date().getTime();
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(
          `users/${credential.user.uid}`
        );
        return userRef.set(content);
      }).catch(error => {
        console.log(error);
      });
  }

  updateUser(uid: string, content: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );
    content['uid'] = uid;
    return userRef.set(content);
  }

  // deleteNote(id: string) {
  //   return this.getUser(id).delete();
  // }
}