import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;

  constructor(private router: Router, private authStore: AuthStore) {}

  ngOnInit(): void {
    // Si ya tenemos token, cargamos el usuario
    if (this.authStore.token()) {
      this.authStore.loadMe().subscribe({
        next: () => {
          // Cuando se cargue el usuario, se actualiza el email
          this.userEmail = this.authStore.user()?.email ?? null;
        },
        error: () => {
          this.authStore.clearSession();
        },
      });
    }

    // También actualizamos si cambia manualmente el user signal
    effect(() => {
      const user = this.authStore.user();
      this.userEmail = user?.email ?? this.userEmail;
    });
  }

  goToTasks(): void {
    this.router.navigateByUrl('/tasks');
  }

  goToAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  logout(): void {
    this.authStore.clearSession();
    this.router.navigateByUrl('/');
  }
}