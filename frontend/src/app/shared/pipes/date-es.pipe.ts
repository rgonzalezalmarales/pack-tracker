import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'dateEs',
})
export class DateEsPipe implements PipeTransform {
  constructor(
    private readonly datePipe: DatePipe,
    private readonly transloco: TranslocoService
  ) {
    transloco.setActiveLang('es');
  }

  translateMonth(month: string | null) {
    if (!month) return '';

    return this.transloco.translate(`date.months.${month}`)?.toLowerCase();
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    if (args.includes('Day')) {
      const day = this.datePipe.transform(<string>value, 'EEEE');

      return this.transloco.translate(`date.days.${day}`);
    } else if (args.includes('medium')) {
      if (this.transloco.getActiveLang() == 'es') {
        const day = this.datePipe.transform(<string>value, 'dd');
        const month = this.datePipe.transform(<string>value, 'MMMM');
        const year = this.datePipe.transform(<string>value, 'yyyy');
        const time = this.datePipe.transform(<string>value, 'mediumTime');

        return `${day} de ${this.translateMonth(month)} de ${year}, ${time}`;
      }

      return this.datePipe.transform(<string>value, 'medium');
    }

    return value;
  }
}
