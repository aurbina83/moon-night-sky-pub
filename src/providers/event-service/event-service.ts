import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

/*
  Generated class for the EventService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EventService {
    public api = "https://app.veteranconnect.co/api/v1/events"

  constructor(private http: Http, private authHttp: AuthHttp) {}
  public getAll(query){
      return new Promise((resolve, reject)=>{
          this.authHttp.get(`${this.api}/?lng=${query.lng}&lat=${query.lat}&maxDist=${query.maxDist}&skip=${query.skip}`)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public getOne(id){
      return new Promise((resolve, reject)=>{
          this.authHttp.get(`${this.api}/${id}`)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public getMine(){
      return new Promise((resolve, reject)=>{
          this.authHttp.get(`${this.api}/myevents`)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, error => {
                reject(error.json());
          })
      })
  }

  public getAttending(){
      return new Promise((resolve, reject)=>{
          this.authHttp.get(`${this.api}/attending`)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public createEvent(event){
      return new Promise((resolve, reject)=>{
          this.authHttp.post(this.api, event)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err =>{
              reject(err.json());
          })
      })
  }

  public update(event){
      return new Promise((resolve, reject)=>{
          this.authHttp.put(`${this.api}/${event._id}`, event)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public attending(id){
      return new Promise((resolve, reject)=>{
          this.authHttp.put(`${this.api}/attending/${id}`, null)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public notAttending(id){
      return new Promise((resolve, reject)=>{
          this.authHttp.put(`${this.api}/notattending/${id}`, null)
          .map(res => res.json())
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

  public remove(id){
      return new Promise((resolve, reject)=>{
          this.authHttp.delete(`${this.api}/${id}`)
          .subscribe(data => {
              resolve(data);
          }, err => {
              reject(err.json());
          })
      })
  }

}
