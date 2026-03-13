// angular-frontend/src/app/modules/admin/dashboard-component/dashboard-component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from "@angular/forms";
import { AuthStore } from "../../../shared/services/auth-store";
import {
  AdminUsersApiService,
  AdminUser,
} from "../../../shared/services/admin-users.service";
import { ToastService } from "../../../shared/services/toast-service";
import { NavbarComponent } from "../../../shared/components/navbar/navbar";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent],
  templateUrl: "./dashboard-component.html",
})
export class AdminDashboardComponent implements OnInit {
  users: AdminUser[] = [];
  form!: FormGroup;
  q = "";

  constructor(
    public readonly store: AuthStore,
    private readonly api: AdminUsersApiService,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  logout() {
    this.store.clearSession();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      nombre: [""],
      roles: [["ROLE_USER"] as string[]],
    }) as FormGroup;
    this.load();
  }
  load(): void {
    this.api.getUsers(this.q).subscribe({ next: (u) => (this.users = u) });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.createUser(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.toast.success("Usuario creado");
        this.form.reset({ roles: ["ROLE_USER"] });
        this.load();
      },
      error: () => this.toast.error("No se pudo crear el usuario"),
    });
  }

  resetPassword(id: number): void {
    this.api.resetPassword(id).subscribe({
      next: (res) =>
        this.toast.info(`Password temporal: ${res.passwordTemporal}`),
      error: () => this.toast.error("No se pudo resetear la password"),
    });
  }
}
