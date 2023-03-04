import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pack-tracker';
  constructor(private readonly transloco: TranslocoService) {}

  ngOnInit(): void {
    this.transloco.selectTranslate('es').subscribe();
  }
}
