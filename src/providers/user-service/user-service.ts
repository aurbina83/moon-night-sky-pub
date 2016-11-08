import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {JwtHelper} from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';
import {AlertController, Platform} from 'ionic-angular';
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
    public token;
    public status = { _id: null, name: null, imgUrl: null, maxDist: null, loc: null, verified: null, branch: null, locStamp: null };
    public LOGIN_URL: string = "https://app.veteranconnect.co/api/v1/users";
    public jwtHelper: JwtHelper = new JwtHelper();

    // public profile = {
    //     id: 10153414012480684,
    //     token: "EAAWf3JZBNDIoBAA6WghDE5Efi1ykjzk1EZBU3MHMIVKGZAc2F7H82gZCZBcPqICRoM4e5wHh3mPG4y6h11eSZCoUwF7KY5X8SGwX9yr8mqNf2r2z8hd9CvcUtPZChYEtc942IMKGfAdoStlVqSqMeFlxqe0mzr2UOb9cgoB01Ei2fhXt8uZAJSJrhGH3iVovZCGxgi5XDnQTUpX8bYeUOILF9q6oZAG3xdDDoZD",
    //     first_name: "Anthony",
    //     last_name: "Urbina",
    //     picture: "https://scontent.xx.fbcdn.net/v/t1.0-1/s200x200/14079793_10153693606430684_3078285146515445794_n.jpg?oh=b03a8c9230e81cd6618846dbc0cac31f&oe=583C28A0"
    // }

    constructor(private authHttp: AuthHttp, private http: Http, private alertCtrl: AlertController, private platform: Platform) {
        this.storage = new Storage();
        this.getToken() ? this.setUser() : this.tokenFetch();
    }



    ///////////////////////////////////////////
    ///////// Token Handling//////////
    ////////////////////////////////////////


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

    public verifyUser(body){
        return new Promise((resolve, reject) =>{
            this.authHttp.post('https://app.veteranconnect.co/api/v1/access', body)
                .map(res => res.json())
                .subscribe(data =>{
                    this.setToken(data.token);
                    resolve(data);
                }, err=>{
                    reject(err.json());
                });
        })
    }

    public setUser() {
        this.token = this.getToken();
        let u = this.jwtHelper.decodeToken(this.token);
        this.status._id = u._id;
        this.status.name = u.firstName + " " + u.lastName;
        this.status.imgUrl = u.imgUrl;
        this.status.branch = u.branch;
        this.status.verified = u.verified;
        if (u.loc) {
            this.status.loc = u.loc;
            this.status.locStamp = u.locStamp;
        }
    }

    public tokenFetch(){
        this.storage.get('id_token').then(data=>{
            if(data) {
                localStorage.setItem('id_token', data);
                this.token = data;
                this.setUser();
            } else {
                console.log('no data');
            }
        })
    }

    public setToken(token: string) {
        this.token = token;
        this.storage.set('id_token', token);
        localStorage.setItem('id_token', token);
        this.setUser();
    }

    public getToken() {
        this.token = localStorage.getItem('id_token');
        return this.token;
    }

    public isAuth() {
        return tokenNotExpired('id_token', this.token);
    }

    public logout() {
        return new Promise((resolve, reject) => {
            this.clearUser();
            facebookConnectPlugin.logout();
            resolve();
        })
    }

    public clearUser() {
        for (var e in this.status) {
            this.status[e] = null;
        }
        this.token = null;
        localStorage.removeItem('id_token');
        this.storage.remove("id_token");
        this.storage.remove("friends");
    }

    ///////////////////////////////////////////
    /////////Login Sequence//////////
    ////////////////////////////////////////
    public loginHTTP(profile) {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.LOGIN_URL}/login`, profile)
                .map(res => res.json())
                .subscribe(
                data => {
                    this.setToken(data.token);
                    resolve("OK");
                },
                err => {
                    reject(err.json());
                })
        })
    }


    fbLogin() {
        return new Promise((resolve, reject) => {
            facebookConnectPlugin.logout();
            facebookConnectPlugin.login(['public_profile', 'user_friends'], (response) => {
                resolve();
            }, (error) => {
                let err = error;
                reject(err);
            })
        })
    }

    fbStatus() {
        return new Promise((resolve, reject) => {
            facebookConnectPlugin.getLoginStatus((response) => {
                if (response.status == "connected") {
                    let id = response.authResponse.userID;
                    let token = response.authResponse.accessToken;
                    facebookConnectPlugin.api('/' + response.authResponse.userID + '?fields=id,first_name,last_name,picture.type(large),friends', [],
                        (result) => {
                            let profile = {
                                id: id,
                                token: token,
                                first_name: result.first_name,
                                last_name: result.last_name,
                                picture: result.picture.data.url
                            }
                            let friends = result.friends.data;
                            this.storage.set('friends', friends);
                            resolve(profile);
                        },
                        (error) => {
                            let err = error;
                            reject(err);
                        });
                }
                else {
                    reject('Not logged in');
                }
            })
        })
    }

    public storeFriends(data){
        let friends = [];
        if(data.length > 0) {
            data.forEach((f)=>{
                friends.push(f.id);
            })
            this.storage.set('friends', friends);
        }
    }

    public login() {
        return new Promise((resolve, reject) => {
            this.fbLogin().then(() => {
                this.fbStatus().then((res) => {
                    this.loginHTTP(res).then(() => {
                        resolve("OK");
                    }, (err) => {
                        reject(err.message);
                    });
                }, (err) => {
                    reject(err);
                })
            }, (err) => {
                reject(err);
            })
        })
    }

    ////////////////////////////////////////////////
    /////////Geolaction Handling/////////
    ///////////////////////////////////////////////

    public checkLocation() {
        return new Promise((resolve, reject) => {
            let date = Date.now();
            if (this.status.locStamp && this.status.locStamp < date && this.status.locStamp != undefined) {
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
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}
