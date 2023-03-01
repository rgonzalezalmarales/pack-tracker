import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_PREFIX } from '../interfaces/project-conts';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`${APP_PREFIX}${key}`, value);
    }
  }

  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(`${APP_PREFIX}${key}`);
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(`${APP_PREFIX}${key}`);
    }
  }
}
