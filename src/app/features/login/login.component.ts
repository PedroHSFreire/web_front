import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  emailError = '';
  passwordError = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  validateEmail(): boolean {
    if (!this.email) { this.emailError = 'Digite seu e-mail'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) { this.emailError = 'E-mail inválido'; return false; }
    this.emailError = '';
    return true;
  }

  validatePassword(): boolean {
    if (!this.password) { this.passwordError = 'Digite sua senha'; return false; }
    if (this.password.length < 6) { this.passwordError = 'Mínimo 6 caracteres'; return false; }
    this.passwordError = '';
    return true;
  }

  async onSubmit() {
    const emailOk = this.validateEmail();
    const passOk = this.validatePassword();
    if (!emailOk || !passOk) return;

    this.isLoading = true;
    const success = await this.auth.login(this.email, this.password);
    this.isLoading = false;

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}