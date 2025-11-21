import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  form!: FormGroup;
  submitting = signal(false);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    this.submitting.set(true);
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    setTimeout(() => {
      const { email, password } = this.form.value;
      if (email === 'admin@example.com' && password === 'secret123') {
        console.log('Login success');
        this.submitting.set(false);
      } else {
        this.form.setErrors({ invalidCredentials: true });
        this.submitting.set(false);
      }
    }, 700);
  }
}
