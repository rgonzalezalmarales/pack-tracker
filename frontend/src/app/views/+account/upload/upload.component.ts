import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { MessageService } from '@app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  loading = false;
  subscriptions: Subscription[] = [];

  percentDone: number = 0;

  constructor(
    private messageService: MessageService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {}

  upload(file: any) {
    this.loading = true;

    this.percentDone = 0;

    if (file.target.files.length > 0) {
      this.subscriptions.push(
        // this.uploadService.uploadExcelFile(file.target.files[0]).subscribe({
        //   next: (d: any) => {
        //     if (d.type === HttpEventType.UploadProgress) {
        //       this.percentDone = Math.round((100 * d.loaded) / d.total);
        //     }

        //     if (this.percentDone === 100) {
        //       this.loading = false;
        //       this.messageService.showMessage('File uploaded!!!');
        //     }
        //   },
        //   error: (e) => {
        //     this.loading = false;
        //     this.messageService.showMessage('Error uploading excel');
        //   },
        // })
      );
    } else {
      this.loading = false;
      this.messageService.showMessage('Please, select a excel file');
    }
  }
}
