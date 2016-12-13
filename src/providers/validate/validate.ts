import { Injectable } from '@angular/core';

@Injectable()
export class Validate {
  tester = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;


  validateMos(mos, regex, max) {
    var valid = regex.test(mos);
    if (!mos) return true;

    if (mos.length > max) return false;

    if (!valid) return false;

    return true;

  }
  validate(email) {
    if (!email)
    		return true;

    if (email.length > 254)
    		return false;

    var valid = this.tester.test(email);
    if (!valid)
    		return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
    		return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function(part) { return part.length > 63; }))
    		return false;

    return true;
  }


  validate_async(email) {
    return new Promise((resolve, reject) => {
      this.validate(email) ? resolve(true) : reject(false)
    })
  }

  constructor() { }

}
