import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastSubject =
    new Subject<ToastMessage>();

  toast$ =
    this.toastSubject.asObservable();

  constructor() {}

  showSuccess(message: string) {
    this.toastSubject.next({
      message,
      type: 'success'
    });
  }

  showError(message: string) {
    this.toastSubject.next({
      message,
      type: 'error'
    });
  }

  showWarning(message: string) {
    this.toastSubject.next({
      message,
      type: 'warning'
    });
  }

  showInfo(message: string) {
    this.toastSubject.next({
      message,
      type: 'info'
    });
  }
}