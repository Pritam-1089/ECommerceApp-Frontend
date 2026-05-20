import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent implements OnInit {

  toasts: ToastMessage[] = [];

  constructor(private notification: NotificationService) {}

  ngOnInit() {
    this.notification.toast$.subscribe((toast) => {
      this.toasts.push(toast);

      setTimeout(() => {
        this.toasts.shift();
      }, 3000);
    });
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}