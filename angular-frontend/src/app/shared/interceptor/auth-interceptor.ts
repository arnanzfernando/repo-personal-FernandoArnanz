// src/app/shared/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../services/auth-store';
import { ToastService } from '../services/toast-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Inyectamos los servicios
  const store = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  // Añadir token si existe
  if (token && !req.headers.has('Authorization')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // Logout técnico
        store.clearSession();
        toast.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    })
  );
};