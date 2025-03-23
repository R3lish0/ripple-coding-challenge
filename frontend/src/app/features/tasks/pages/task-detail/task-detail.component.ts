import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from '../../../../models/task.model';
import { TaskService } from '../../../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="task-detail-container">
      <mat-card *ngIf="task" class="task-card">
        <mat-card-header>
          <mat-card-title>{{ task.title }}</mat-card-title>
          <mat-card-subtitle>
            <mat-chip [ngClass]="getPriorityClass(task.priority)" selected>
              <mat-icon>{{getPriorityIcon(task.priority)}}</mat-icon>
              {{ task.priority }}
            </mat-chip>
            <mat-chip [ngClass]="getStatusClass(task.status)" selected>
              <mat-icon>{{getStatusIcon(task.status)}}</mat-icon>
              {{ task.status }}
            </mat-chip>
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="task-info">
            <div class="info-section">
              <h3>Description</h3>
              <p>{{ task.description }}</p>
            </div>

            <div class="info-section">
              <h3>Due Date</h3>
              <p>{{ task.dueDate | date:'mediumDate' }}</p>
            </div>

            <div class="info-section">
              <h3>Created</h3>
              <p>{{ task.createdAt | date:'medium' }}</p>
            </div>

            <div class="info-section">
              <h3>Last Updated</h3>
              <p>{{ task.updatedAt | date:'medium' }}</p>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button routerLink="/tasks">
            <mat-icon>arrow_back</mat-icon>
            Back to List
          </button>
          <button mat-raised-button color="primary" [routerLink]="['/tasks', task.id, 'edit']">
            <mat-icon>edit</mat-icon>
            Edit Task
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTask(taskId).subscribe({
      next: (task) => {
        this.task = task;
      },
      error: (error) => {
        console.error('Error loading task:', error);
      }
    });
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
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'check_circle';
      default:
        return 'check_circle';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'check_circle';
      case 'inprogress':
        return 'refresh';
      case 'pending':
        return 'schedule';
      default:
        return 'check_circle';
    }
  }
}
