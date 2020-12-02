import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notificationService: NzNotificationService) {
    this.notificationService.config({
      nzPlacement: 'bottomLeft'
    });
  }

  showNotification(info: any) {
    this.notificationService.create(
      info.type,
      info.title,
      info.content,
      {
        nzDuration: info.duration
      }
    );
  }
}
