import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
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
  this.orderService.getAllOrders().subscribe({
    next: (res) => {
      if (res.success) {
        this.orders = res.data;
      }
    },
    error: (err) => console.error(err)
  });
}


  updateStatus(orderId: number, event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, value).subscribe(() => this.loadOrders());
  }
}
