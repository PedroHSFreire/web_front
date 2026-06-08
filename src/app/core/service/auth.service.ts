import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_BASE = environment.apiUrl;

  private _currentUser = signal<User | null>(null);
  public currentUser = this._currentUser.asReadonly();

  constructor(private http: HttpClient, private toast: ToastService) {
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; token: string; user: User }>(`${this.API_BASE}/auth/login`, {
          email,
          senha: password
        })
      );
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        this._currentUser.set(response.user);
        this.toast.show('Login realizado com sucesso!', 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.error?.erro || 'Erro ao fazer login';
      this.toast.show(message, 'error');
      return false;
    }
  }

  async register(nome: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; token?: string; user?: User }>(`${this.API_BASE}/auth/register`, {
          nome,
          email,
          senha: password
        })
      );
      if (response.success) {
        if (response.token && response.user) {
          localStorage.setItem('auth_token', response.token);
          this._currentUser.set(response.user);
        }
        this.toast.show('Conta criada com sucesso!', 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.error?.erro || 'Erro ao criar conta';
      this.toast.show(message, 'error');
      return false;
    }
  }

  async ensureCurrentUser(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      const response = await firstValueFrom(
        this.http.get<{ success: boolean; user: User }>(`${this.API_BASE}/auth/me`, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
        })
      );
      if (response.success) {
        this._currentUser.set(response.user);
        return true;
      }
      this.logout();
      return false;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this._currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this._currentUser() !== null;
  }
}
