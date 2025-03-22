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
            <mat-chip [color]="getPriorityColor(task.priority)" selected>
              {{ task.priority }}
            </mat-chip>
            <mat-chip [color]="getStatusColor(task.status)" selected>
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
    // TODO: Replace with actual service call to get task details
    // For now, we'll use mock data from the task list
    this.task = {
      id: taskId,
      title: 'Sample Task',
      description: 'This is a sample task description',
      dueDate: new Date(),
      priority: 'Medium',
      status: 'InProgress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      case 'low':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'primary';
      case 'inprogress':
        return 'accent';
      case 'pending':
        return 'warn';
      default:
        return 'primary';
    }
  }
}
