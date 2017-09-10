import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { User } from './user';

@Injectable()
export class AuthService {

  authState: any = null;
  user: User;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {

    let result: string;
    if (this.authState['displayName']) {
      result = this.authState['displayName'];
    } else if (!!this.user && !!this.user.firstname) {
      result = this.user.firstname;
    } else {
      result = 'User';
    }

    return result;
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData(credential);
        this.getUserData();
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(input: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(input.email, input.password)
      .then((u) => {
        this.authState = u;
        this.user = input;
        this.updateUserData(input);
      });
  }

  emailLogin(input: User) {
    return this.afAuth.auth.signInWithEmailAndPassword(input.email, input.password)
      .then((u) => {
        this.authState = u;
        this.getUserData();
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut();
    this.user = null;
    this.router.navigate(['/']);
  }

  //// Helpers ////
  private updateUserData(input: User): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    const path = `users/${this.currentUserId}`; // Endpoint on firebase
    const data = {
      email: this.authState.email,
      firstname: input.firstname,
      lastname: input.lastname,
      name: this.authState.displayName,
      balance: 0,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }

  private getUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    const path = `users/${this.currentUserId}`; // Endpoint on firebase

    this.db.object(path)
      .subscribe((res) => {
        console.log(res);
        this.user = res;
      });
  }
}