import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/Models';
import { LoginUserBody } from 'src/app/RequestModels';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  public formLogin: any = FormGroup;
  public emailInput: string = '';
  public passwordInput: string = '';
  public subcription = new Subscription();
  public hasError: boolean = false;
  public error = {
    message: '',
  };
  public isLoading:boolean = false
  constructor(
    private fb: FormBuilder,
    public apiClient: ApiClientService,
    public route: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      email: this.fb.control('', (Validators.required, Validators.email)),
      password: this.fb.control('', Validators.required),
    });
  }

  onSubmit() {
    const body: LoginUserBody = {
      user: {
        ...this.formLogin.value,
      },
    };
    this.hideLoader()
    this.subcription.add(
      this.apiClient.loginUser(body).subscribe({
        next: (res: { user: User }) => {
            this.isLoading = false
            this.formLogin.reset();
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
          this.error.message = err.errors['email or password'];
        },
      })
    );
  }

  hideLoader(){
    this.isLoading = true
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

}
