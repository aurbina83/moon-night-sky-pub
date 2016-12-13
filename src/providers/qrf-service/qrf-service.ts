import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'

/*
  Generated class for the QrfService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class QrfService {
  public api = "https://app.veteranconnect.co/api/v1/qrf"
  constructor(private http: Http, private authHttp: AuthHttp) { }


  public getMine() {
    return this.authHttp.get(this.api)
      .map(res => res.json())
  }

  public getOne(id) {
    return this.authHttp.get(`${this.api}/${id}`)
      .map(res => res.json())
  }

  public create(qrf) {
    return this.authHttp.post(this.api, qrf)
      .map(res => res.json())
  }

  public join(id) {
    return this.authHttp.put(`${this.api}/${id}`, null)
      .map(res => res.json())
  }

  public chat(id, message) {
    return this.authHttp.put(`${this.api}/chat/${id}`, message)
      .map(res => res.json())
  }
}
