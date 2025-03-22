import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule,
  ],
  template: `
    <div class="task-form-container">
      <h2>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="InProgress">In Progress</mat-option>
            <mat-option value="Completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" routerLink="/tasks">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!taskForm.valid">
            {{ isEditMode ? 'Update Task' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  originalTask: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null, Validators.required],
      priority: ['Medium', Validators.required],
      status: ['Pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask();
    }
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => {
          this.originalTask = task;
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate),
            priority: task.priority,
            status: task.status
          });
        },
        error: (error) => {
          this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      if (this.isEditMode && this.taskId && this.originalTask) {
        const updateData = {
          ...taskData,
          id: this.taskId,
          createdAt: this.originalTask.createdAt,
          updatedAt: new Date()
        };
        this.taskService.updateTask(this.taskId, updateData).subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.snackBar.open('Error updating task', 'Close', { duration: 3000 });
          }
        });
      } else {
        const createData = {
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.taskService.createTask(createData).subscribe({
          next: () => {
            this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.snackBar.open('Error creating task', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }
}
