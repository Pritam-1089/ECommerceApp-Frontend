import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Pagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders(this.currentPage, this.pageSize).subscribe(res => {
      if (res.success) {
        this.orders = res.data;
        this.totalPages = res.totalPages ?? 1;
      }
    });
  }

  onPageChange(event: { page: number; size: number }) {
    this.currentPage = event.page;
    this.pageSize = event.size;
    this.loadOrders();
  }
}