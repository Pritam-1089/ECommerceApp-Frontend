import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {

  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<{page: number, size: number}>();

  onPrev() {
    this.pageChanged.emit({ page: this.currentPage - 1, size: this.pageSize });
  }

  onNext() {
    this.pageChanged.emit({ page: this.currentPage + 1, size: this.pageSize });
  }

  onSizeChange(event: Event) {
    const size = +(event.target as HTMLSelectElement).value;
    this.pageChanged.emit({ page: 1, size });
  }
}