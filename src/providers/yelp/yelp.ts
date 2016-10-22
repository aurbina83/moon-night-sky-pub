import { Injectable } from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/map';

/*
  Generated class for the Yelp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Yelp {

  constructor(private authHttp: AuthHttp) {}
  yelp(query) {
      return new Promise((resolve, reject)=>{
          this.authHttp.get(`https://app.veteranconnect.co/api/v1/yelp/search?term=${query.term}&location=${query.location}&cll=${query.cll.lat},${query.cll.lng}&sort=0&offset=${query.offset}&limit=20`)
              .map(res => res.json())
              .subscribe(data => {
                  resolve(data);
              }, err =>{
                  reject(err);
              })
      })
  }
}
