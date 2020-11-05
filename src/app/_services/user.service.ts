import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from '../_models/index';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable()
export class UserService {

  usersCollection: AngularFirestoreCollection<any>;
  noteDocument: AngularFirestoreDocument<any>;
  arrUsers;
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth,
    private afAuth2: AngularFireAuth,
    private afs: AngularFirestore,
    private functions :AngularFireFunctions
  ) {
    this.usersCollection = this.firestore.collection('users');
  }



  getAllUser() {
    return this.firestore.collection('users').valueChanges();
  }

  getUserCondn(condn = null) {
    return this.firestore.collection('users', ref => ref.where(condn.key, '==', condn.value)).valueChanges()

  }

  getMultipleUser(uid) {
    return this.firestore.collection('users', ref => ref.where('parent', '==', uid)).valueChanges()
  }
  getMeterDetails(date = null,uid) {

    return this.firestore.collection('meterDetails', ref => ref.where("ReadingTimeTimestamp", '>=', date)).valueChanges();

  }

  sendResetPasswordEmail(userEmail) {
    let html = '<html><body><p>Dear User,</p> <p> reset your password <a href="">reset </a> .</p></body></html>';
    const callable = this.functions.httpsCallable('sendEmail');
    
    const obs = callable({ subject: 'Password reset' ,
    email: userEmail,
    html:html
  });

    obs.subscribe(async res => {
        console.log('email send');
    });
  }

  createUser(content) {

    return this.afAuth2.auth
      .createUserWithEmailAndPassword(content.email, "Welcome123")
      .then(credential => {
        content['uid'] = credential.user.uid
        content['time'] = new Date().getTime();
        content['otp'] = new Date().getTime();
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(
          `users/${credential.user.uid}`
        );

        this.afAuth2.auth.sendPasswordResetEmail('pguthalkar@gmail.com').then(
          () => {
            console.log('reset email sent');
          },
          err => {
            // handle errors
          }
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

}