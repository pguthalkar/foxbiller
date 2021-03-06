import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from '../_models/index';

@Injectable()
export class MeterService {

  meterCollection: AngularFirestoreCollection<any>;
  noteDocument: AngularFirestoreDocument<any>;
  private meterDataSubject = new BehaviorSubject([]);
  arrUsers;
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth,
    private afAuth2: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.meterCollection = this.firestore.collection('meterDetails');
    // this.arrUsers = this.firestore.collection('meterDetails').snapshotChanges();
  }



  getAllMeter(condn) {
    // ['added', 'modified', 'removed']
    // return this.meterCollection.snapshotChanges();
    return this.firestore.collection('meterDetails', ref => ref.where(condn.key, '==', condn.value).orderBy('ReadingTimeTimestamp', 'desc')).valueChanges();
  }

  getMeterHistory(condn) {
    // ['added', 'modified', 'removed']
    // return this.meterCollection.snapshotChanges();
    return this.firestore.collection('importHistory', ref => ref.where(condn.key, '==', condn.value).orderBy('dateCreated', 'desc')).valueChanges();
  }

  getMeterDetailCondn(condn = null, condn2 = null) {
    return this.firestore.collection('meterDetails', ref => ref.where(condn.key, '==', condn.value).where(condn2.key, '==', condn2.value).orderBy('ReadingTimeTimestamp', 'desc')).valueChanges();

  }
  getMeterDetailCondn1(condn = null) {
    return this.firestore.collection('meterDetails', ref => ref.where(condn.key, '==', condn.value).orderBy('ReadingTimeTimestamp', 'desc')).valueChanges();

  }

  updateMeterSata(data: []) {
    this.meterDataSubject.next(data);
  }

  getUpdatedMeterData() {
    return this.meterDataSubject.asObservable();
  }
  getMeterDetails(date = null) {
    return this.firestore.collection('meterDetails', ref => ref.where("ReadingTimeTimestamp", '>=', date)).valueChanges();

  }


  createSetting(data) {
    const settingRef: AngularFirestoreDocument<User> = this.afs.doc(
      `settings/${data.uid}`
    );
    return settingRef.set(data);
  }

  deleteMeter(docId) {
    // return this.firestore.collection('meterDetails', ref => ref.where('CustomerNumber', '==', CustomerNumber).orderBy('ReadingTimeTimestamp', 'asc').limit(1));
    this.afs.doc(
      `meterDetails/${docId}`
    ).delete();
   
  }

  deleteInvoice(docId) {
    // return this.firestore.collection('meterDetails', ref => ref.where('CustomerNumber', '==', CustomerNumber).orderBy('ReadingTimeTimestamp', 'asc').limit(1));
    this.afs.doc(
      `invoices/${docId}`
    ).delete();
   
  }

  createInvoice(data) {
    const invoiceRef: AngularFirestoreDocument<User> = this.afs.doc(
      `invoices/${data.invoiceId}`
    );
    return invoiceRef.set(data);
  }

  createMeter(data) {
    let id = `${data.CustomerNumber + `-` + data.meters.meterId + `-` + data.readingTime}`;
    const meterDetailsRef: AngularFirestoreDocument = this.afs.doc(
      `meterDetails/`
    )
  }

  getSettings(uid) {
    return this.firestore.collection('settings', ref => ref.where("uid", '==', uid)).valueChanges();
  }

  getInvoicesCondn(condn = null) {
    return this.firestore.collection('invoices', ref => ref.where(condn.key, condn.operator, condn.value)).valueChanges();
  }

  updateSetting(data) {
    const settingRef: AngularFirestoreDocument<User> = this.afs.doc(
      `settings/${data.uid}`
    );
    data['uid'] = data.uid;
    return settingRef.set(data);
  }

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

  createImportHistory(data) {
    const importHistoryRef: AngularFirestoreDocument<User> = this.afs.doc(
      `importHistory/${data._id}`
    );
    return importHistoryRef.set(data);
  }

  // updateUser(id: string, data: any) {
  //   return this.getUser(id).update(data);
  // }

  // deleteNote(id: string) {
  //   return this.getUser(id).delete();
  // }
}