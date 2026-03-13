import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-task-form-component",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./task-form-component.html",
})
export class TaskFormComponent implements OnInit {

  @Output() submitted = new EventEmitter<any>();
  form!: FormGroup;
  isLoading = false;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ["", [Validators.required, Validators.minLength(3)]],
      descripcion: ["", [Validators.maxLength(500)]],
      estado: ["pendiente", [Validators.required]],
      fechaLimite: [null],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.submitted.emit(this.form.getRawValue());

    // Opcional: reset del formulario si quieres
    // this.form.reset({ estado: 'pendiente' });

    this.isLoading = false;
  }
}