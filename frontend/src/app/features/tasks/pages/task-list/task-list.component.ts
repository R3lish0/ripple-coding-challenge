import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule, MatSortModule, MatPaginatorModule, MatChipsModule, MatTooltipModule],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>Task List</h1>
      </div>
      
      <table mat-table [dataSource]="paginatedTasks" matSort (matSortChange)="sortData($event)">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
          <td mat-cell *matCellDef="let task">{{task.title}}</td>
        </ng-container>
        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
          <td mat-cell *matCellDef="let task">{{task.dueDate | date}}</td>
        </ng-container>
        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
          <td mat-cell *matCellDef="let task">
            <mat-chip [class]="getPriorityClass(task.priority)" selected [matTooltip]="task.priority">
              <mat-icon>{{getPriorityIcon(task.priority)}}</mat-icon>
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
          <td mat-cell *matCellDef="let task">
            <mat-chip [class]="getStatusClass(task.status)" selected [matTooltip]="task.status">
              <mat-icon>{{getStatusIcon(task.status)}}</mat-icon>
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let task">
            <button mat-icon-button [routerLink]="[task.id]" matTooltip="Edit Task">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteTask(task.id)" matTooltip="Delete Task">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator
        [length]="tasks.length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        (page)="onPageChange($event)"
        aria-label="Select page">
      </mat-paginator>

      <button mat-fab color="primary" class="fab-button" routerLink="new" matTooltip="Add New Task">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 500;
    }
    table {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .mat-mdc-header-cell {
      cursor: pointer;
      background: #f5f5f5;
      font-weight: 500;
    }
    .mat-mdc-row:hover {
      background: #f8f8f8;
    }
    mat-paginator {
      margin-top: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .fab-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    mat-chip {
      font-weight: 500;
      transition: all 0.3s ease;
      height: 32px;
      width: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    mat-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .priority-high {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
    .priority-medium {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }
    .priority-low {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .status-completed {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .status-inprogress {
      background-color: #e3f2fd !important;
      color: #1565c0 !important;
    }
    .status-pending {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'dueDate', 'priority', 'status', 'actions'];
  pageSize = 10;
  currentPage = 0;
  paginatedTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks()
  }

  updatePaginatedTasks(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.tasks.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.updatePaginatedTasks();
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  sortData(sort: Sort) {
    const data = [...this.tasks];
    if (!sort.active || sort.direction === '') {
      this.tasks = data;
      this.updatePaginatedTasks();
      return;
    }

    this.tasks = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'dueDate':
          return compare(a.dueDate, b.dueDate, isAsc);
        case 'priority':
          return compare(a.priority, b.priority, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.updatePaginatedTasks();
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-low';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'inprogress':
        return 'status-inprogress';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-completed';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'double_arrow';
      case 'medium':
        return 'keyboard_double_arrow_right';
      case 'low':
        return 'keyboard_arrow_right';
      default:
        return 'keyboard_arrow_right';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'check_circle';
      case 'inprogress':
        return 'play_circle';
      case 'pending':
        return 'pending';
      default:
        return 'task_alt';
    }
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  if (a instanceof Date && b instanceof Date) {
    return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
