import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateEs',
})
export class DateEsPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    if (args.includes('Day')) {
      const date = new Date(<string>value);

      const map = new Map<number, string>([
        [1, 'Lunes'],
        [2, 'Martes'],
        [3, 'Miércoles'],
        [4, 'Jueves'],
        [5, 'Viernes'],
        [6, 'Sábado'],
        [7, 'Domingo'],
      ]);

      return map.get(date.getDay());
    } else if (args.includes('medium')) {
      const date = new Date(<string>value);

      const map = new Map<number, string>([
        [0, 'enero'],
        [1, 'febrero'],
        [2, 'marzo'],
        [3, 'abril'],
        [4, 'mayo'],
        [5, 'junio'],
        [6, 'julio'],
        [7, 'agosto'],
        [8, 'septiembre'],
        [9, 'octubre'],
        [10, 'noviembre'],
        [11, 'diciembre'],
      ]);

      const month = map.get(date.getMonth());
      const year = date.getFullYear();
      const time = this.datePipe.transform(date, 'mediumTime');

      let _strDate = `${date.getDate()}`;
      if (_strDate?.length === 0) {
        _strDate = `0${_strDate}`;
      }

      return `${_strDate} de ${month} de ${year}, ${time}`;
    }

    return value;
  }
}
