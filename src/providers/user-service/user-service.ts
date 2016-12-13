import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {JwtHelper} from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';
import {AlertController, Platform} from 'ionic-angular';
import {Geolocation, AppVersion} from 'ionic-native';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

// Declare variable for Facebook Plugin
declare var facebookConnectPlugin;

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

  public storage: Storage;
  public status = { _id: null, name: null, imgUrl: null, maxDist: null, loc: null, verified: null, branch: null, locStamp: null };
  public LOGIN_URL: string = "https://app.veteranconnect.co/api/v1/users";
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(private authHttp: AuthHttp, private http: Http, private alertCtrl: AlertController, private platform: Platform) {
    if (this.getToken()) this.setUser();
    this.storage = new Storage();
  }



  ///////////////////////////////////////////
  ///////// Token Handling//////////
  ////////////////////////////////////////

  // Update any user profile parameters and update status
  public updateUser(route, id, user) {
    return new Promise((resolve, reject) => {
      this.http.put(`${this.LOGIN_URL}/${route}/${id}`, user)
        .map(res => res.json())
        .subscribe(data => {
          if (data.token) {
            this.setToken(data.token);
            resolve();
          } else {
            resolve(data);
          }
        }, err => {
          reject(err.json());
        });
    });
  }

  // Verify user and update status
  public verifyUser(body) {
    return new Promise((resolve, reject) => {
      this.authHttp.post('https://app.veteranconnect.co/api/v1/access', body)
        .map(res => res.json())
        .subscribe(data => {
          this.setToken(data.token);
          resolve(data);
        }, err => {
          reject(err.json());
        });
    })
  }

  // Decode token and set user status
  public setUser(userToken?) {
    let token;
    userToken ? token = userToken : token = this.getToken();
    let u = this.jwtHelper.decodeToken(token);
    this.status._id = u._id;
    this.status.name = u.firstName + " " + u.lastName;
    this.status.imgUrl = u.imgUrl;
    this.status.branch = u.branch;
    this.status.verified = u.verified;
    if (u.loc) {
      this.status.loc = u.loc;
      this.status.locStamp = u.locStamp;
    }
    return this.status;
  }

  // In case the token is deleted from the local storage, check to see if it's available in SqLite.
  public tokenCheck() {
    return new Promise((resolve, reject) => {
      this.storage.get('id_token').then(data => {
        if (data) {
          localStorage.setItem('id_token', data);
          let token = data;
          resolve(this.setUser(token))
        } else {
          console.log('no data');
          reject();
        }
      })
    })
  }

  // Token to both local and SQlite
  public setToken(token: string) {
    this.storage.set('id_token', token);
    localStorage.setItem('id_token', token);
    this.setUser();
  }

  public getToken() {
    return localStorage.getItem('id_token');
  }

  public isAuth() {
    return tokenNotExpired('id_token', this.getToken());
  }


  public logout() {
    return new Promise((resolve, reject) => {
      this.clearUser();
      facebookConnectPlugin.logout();
      resolve();
    })
  }

  // Clear the user status and delete token from all storage
  public clearUser() {
    for (var e in this.status) {
      this.status[e] = null;
    }
    localStorage.removeItem('id_token');
    this.storage.remove("id_token");
    this.storage.remove("friends");
  }

  ///////////////////////////////////////////
  /////////Login Sequence//////////
  ////////////////////////////////////////

  // Login with profile info from facebook, set the token, and resolve with the user status
  public loginHTTP(profile) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.LOGIN_URL}/login`, profile)
        .map(res => res.json())
        .subscribe(
        data => {
          this.setToken(data.token);
          resolve(this.setUser(data.token));
        },
        err => {
          reject(err.json());
        })
    })
  }

  // Facebook login and profile grab
  fbLogin() {
    return new Promise((resolve, reject) => {
      facebookConnectPlugin.logout();
      facebookConnectPlugin.login(['public_profile', 'user_friends', 'email'], (response) => {
        let id = response.authResponse.userID;
        let token = response.authResponse.accessToken;

        // Take the userID from the login response and grap profile info
        facebookConnectPlugin.api('/' + response.authResponse.userID + '?fields=id,first_name,last_name,picture.type(large),friends,email', [],
          (result) => {
            let version;
            // Check app version from cordova and attach it to the profile object.
            AppVersion.getVersionNumber().then(data => {
              version = data;
              let profile = {
                id: id,
                token: token,
                first_name: result.first_name,
                last_name: result.last_name,
                picture: result.picture.data.url,
                email: result.email,
                platform: this.platform.is('ios') ? 'ios' : 'android',
                appVersion: version
              }
              let friends = result.friends.data;
              this.storeFriends(friends);
              resolve(profile);
            }, err => {
              // If cordova plugin fails, still set the profile info.
              let profile = {
                id: id,
                token: token,
                first_name: result.first_name,
                last_name: result.last_name,
                picture: result.picture.data.url,
                email: result.email,
                platform: this.platform.is('ios') ? 'ios' : 'android',
                appVersion: version
              }
              let friends = result.friends.data;
              // Store the users facebook friends and resolve the profile object
              this.storeFriends(friends);
              resolve(profile);
            });
          },
          // Catch error on profile grab
          (error) => {
            let err = error;
            reject(err);
          });
      },
        // Catch error on facebook login
        (error) => {
          let err = error;
          reject(err);
        })
    })
  }


  // Store facebook friends for later use (to appease the Elite of Apple and their requirements)
  public storeFriends(data) {
    let friends = [];
    if (data.length > 0) {
      friends = data.map(f => {
        return f.id;
      });
      this.storage.set('friends', friends);
    }
  }

  // Login sequence. Login through facebook, take the response (profile object)
  // and login to server via HTTP. Resolve the decoded token (user status object);
  public login() {
    return new Promise((resolve, reject) => {
      this.fbLogin()
        .then(res => this.loginHTTP(res))
        .then(res => resolve(res))
        .catch(err => {
          if (err.message) reject(err.message);
          else reject(err);
        })
    });
  }

  ////////////////////////////////////////////////
  /////////Geolaction Handling/////////
  ///////////////////////////////////////////////

  public checkLocation() {
    return new Promise((resolve, reject) => {
      let date = Date.now();
      if ((this.status.locStamp && this.status.locStamp < date) || (this.status._id && !this.status.locStamp)) {
        this.getLocation();
        resolve();
      } else {
        resolve();
      }
    })
  }

  public getLocation() {
    let success = (position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      let array = [lng, lat];
      let stamp = position.timestamp;
      stamp += (10 * 60 * 1000);
      this.status.loc = array;
      let user = {
        loc: array,
        locStamp: stamp
      }
      this.updateUser("location", this.status._id, user);
    }

    let error = (err) => {
      let alerts = this.alertCtrl.create({
        title: "Location Unavailable",
        subTitle: "If you have reception, make sure Veteran Connect has access to locations in your device settings",
        buttons: ['OK']
      })
      alerts.present();
    }

    let options = {
      timeout: 20000,
      enableHighAccuracy: true
    }
    this.platform.ready().then(() => {
      Geolocation.getCurrentPosition(options).then(position => success(position), err => error(err));
    })
  }
}
