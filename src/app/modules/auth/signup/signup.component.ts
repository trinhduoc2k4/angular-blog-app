import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/Models';
import { RegisterUserBody } from 'src/app/RequestModels';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public formRegister = new FormGroup({});
  public usernameInput: string = '';
  public emailInput: string = '';
  public passwordInput: string = '';
  public subscription = new Subscription();
  public hasError: boolean = false;
  public error = {
    email: '',
    username: '',
  };
  public isLoading:boolean = false
  constructor(
    private fb: FormBuilder,
    public apiClient: ApiClientService,
    public route: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.formRegister = this.fb.group({
      username: this.fb.control('', Validators.required),
      email: this.fb.control('', (Validators.required, Validators.email)),
      password: this.fb.control('', Validators.required),
    });
  }

  onSubmit() {
    const body: RegisterUserBody = {
      user: {
        ...this.formRegister.value,
      },
    };
    this.hideLoader()
    this.subscription.add(
      this.apiClient.registerUser(body).subscribe({
        next: (res: { user: User }) => {
          this.isLoading = false
          this.formRegister.reset();
          const url = this.auth.redirectUrl;
            if (url) {
              this.auth.redirectUrl = '';
              this.route.navigate([url]);
            }
            else {
              this.route.navigate(['home']);
            }
        },
        error: (err) => {
          this.isLoading = false
          this.hasError = true;
          this.error.username = err.errors.username;
          this.error.email = err.errors.email;
        },
      })
    );
  }

  hideLoader(){
    this.isLoading = true
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
