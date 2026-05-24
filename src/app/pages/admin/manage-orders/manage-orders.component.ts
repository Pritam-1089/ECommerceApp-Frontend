import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  statuses = [
    { value: 0, label: 'Pending' }, { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Processing' }, { value: 3, label: 'Shipped' },
    { value: 4, label: 'Delivered' }, { value: 5, label: 'Cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders = res.data;
          this.totalPages = res.totalPages ?? 1;
        }
      },
      error: (err) => console.error(err)
    });
  }

  onPageChange(event: { page: number; size: number }) {
    this.currentPage = event.page;
    this.pageSize = event.size;
    this.loadOrders();
  }

  updateStatus(orderId: number, event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, value).subscribe(() => this.loadOrders());
  }
}