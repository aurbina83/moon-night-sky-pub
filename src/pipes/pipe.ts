import { Pipe } from '@angular/core';
import moment from 'moment';

/*
  Generated class for the Pipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'moments'
})

export class Moment {
  /*
    Takes a value and makes it lowercase.
   */
   transform(value, args) {
     value = value + '';
     args = args + '';
     return moment(value).format(args)
   }
}

@Pipe ({
    name: 'momentFromNow'
})

export class MomentFromNow {
    transform(value) {
        value = value + '';
        return moment(value).fromNow();
    }
}
