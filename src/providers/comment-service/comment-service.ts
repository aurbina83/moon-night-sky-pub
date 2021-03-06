import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'

/*
  Generated class for the CommentService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommentService {
  public api = "https://app.veteranconnect.co/api/v1/comments"
  constructor(private http: Http, private authHttp: AuthHttp) { }

  public create(comment) {
    return this.authHttp.post(this.api, comment)
      .map(res => res.json()).toPromise();
  }
}
