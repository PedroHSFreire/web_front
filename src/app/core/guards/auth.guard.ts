import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authenticated = await auth.ensureCurrentUser();
  return authenticated ? true : router.parseUrl('/login');
};
