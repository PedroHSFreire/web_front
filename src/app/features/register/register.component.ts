import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmSenha = '';
  errors = { nome: '', email: '', senha: '', confirm: '' };
  isLoading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  validateNome(): boolean {
    if (!this.nome) { this.errors.nome = 'Digite seu nome'; return false; }
    if (this.nome.length < 3) { this.errors.nome = 'Nome muito curto'; return false; }
    this.errors.nome = ''; return true;
  }

  validateEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) { this.errors.email = 'Digite seu e-mail'; return false; }
    if (!regex.test(this.email)) { this.errors.email = 'E-mail inválido'; return false; }
    this.errors.email = ''; return true;
  }

  validateSenha(): boolean {
    if (!this.senha) { this.errors.senha = 'Digite sua senha'; return false; }
    if (this.senha.length < 6) { this.errors.senha = 'Mínimo 6 caracteres'; return false; }
    this.errors.senha = ''; return true;
  }

  validateConfirm(): boolean {
    if (this.senha !== this.confirmSenha) { this.errors.confirm = 'As senhas não coincidem'; return false; }
    this.errors.confirm = ''; return true;
  }

  async onSubmit() {
    const ok = this.validateNome() && this.validateEmail() && this.validateSenha() && this.validateConfirm();
    if (!ok) return;

    this.isLoading = true;
    const success = await this.auth.register(this.nome, this.email, this.senha);
    this.isLoading = false;

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
