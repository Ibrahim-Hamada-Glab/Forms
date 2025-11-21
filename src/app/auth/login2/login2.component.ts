import {
  afterNextRender,
  AfterViewInit,
  Component,
  Inject,
  DestroyRef,
  signal,
  viewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login2.component.html',
  styleUrl: './login2.component.css',
})
export class Login2Component {
  submitting = signal(false);
  private form = viewChild<NgForm>('form');

  private destroyedRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      console.log(this.form());
      console.log(email);
      console.log(password);

      var formValueChanges = this.form()
        ?.valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value: any) => {
            localStorage.setItem('email', value['email']);
            localStorage.setItem('password', value['password']);
            console.log('value changed', value);
          },
          error: (error: any) => {
            console.log(error);
          },
          complete: () => {
            console.log('complete');
          },
        });
      this.destroyedRef?.onDestroy(() => {
        formValueChanges?.unsubscribe();
      });

      if (email && password) {
        setTimeout(() => {
          this.form()?.setValue({
            email: email,
            password: password,
          });
        });
      }
    });
  }

  onSubmit(formData: NgForm): void {
    if (formData.form.invalid) {
      formData.form.markAllAsTouched();
      console.log('Invalid form', formData.form.get('email')?.errors);
      console.log('Invalid form', formData.form.get('password')?.errors);
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      if (
        formData.form.value.email === 'admin@example.com' &&
        formData.form.value.password === 'secret123'
      ) {
        console.log('Login success');
        this.submitting.set(false);
      } else {
        console.log('Invalid credentials', formData.form.get('email')?.errors);
        formData.form.setErrors({ invalidCredentials: true });
        console.log('Invalid credentials', formData.form?.errors);

        this.submitting.set(false);
        formData.resetForm();
      }
    }, 700);
  }
}
