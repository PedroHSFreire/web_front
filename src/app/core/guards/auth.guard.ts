import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.hasStoredToken() ? true : router.parseUrl('/login');
};
