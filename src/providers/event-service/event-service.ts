import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'

/*
  Generated class for the EventService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EventService {
  public api = "https://app.veteranconnect.co/api/v1/events"

  constructor(private http: Http, private authHttp: AuthHttp) { }
  public getAll(query) {
    return this.authHttp.get(`${this.api}/?lng=${query.lng}&lat=${query.lat}&maxDist=${query.maxDist}&skip=${query.skip}`)
      .map(res => res.json());
  }

  public getOne(id) {
    return this.authHttp.get(`${this.api}/${id}`)
      .map(res => res.json())
  }

  public getMine() {
    return this.authHttp.get(`${this.api}/myevents`)
      .map(res => res.json());
  }

  public getAttending() {
    return this.authHttp.get(`${this.api}/attending`)
      .map(res => res.json());

  }

  public createEvent(event) {
    return this.authHttp.post(this.api, event)
      .map(res => res.json());
  }

  public update(event) {
    return this.authHttp.put(`${this.api}/${event._id}`, event)
      .map(res => res.json());
  }

  public attending(id) {
    return this.authHttp.put(`${this.api}/attending/${id}`, null)
      .map(res => res.json());
  }

  public notAttending(id) {
    return this.authHttp.put(`${this.api}/notattending/${id}`, null)
      .map(res => res.json());
  }

  public remove(id) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.api}/${id}`)
        .map(res => res.json());
    });
  }

}
