import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../../Models';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UpdateUser } from 'src/app/RequestModels';
import { Subscription } from 'rxjs';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, DoCheck, OnDestroy {
  public user!: User;
  public isLoading: boolean = true;
  public formUpdate = new FormGroup({
    image: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    bio: new FormControl(''),
    password: new FormControl(''),
    username: new FormControl('', Validators.required),
  });
  public subscription = new Subscription();
  public hasErrorEmail: boolean = false;
  public hasErrorName: boolean = false;
  public error = {
    email: '',
    username: '',
    bio: '',
    image: '',
  };
  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiClient: ApiClientService,
    public auth: AuthService
  ) {}

  get email() {
    return this.formUpdate.get('email')!;
  }
  get username() {
    return this.formUpdate.get('username')!;
  }
  get bio() {
    return this.formUpdate.get('email')!;
  }
  get image() {
    return this.formUpdate.get('image')!;
  }
  get password() {
    return this.formUpdate.get('password')!;
  }

  ngOnInit(): void {
    if (!this.auth.getToken()) {
      this.auth.redirectUrl = this.router.url;
      this.router.navigate(['/auth']);
      return;
    }
    this.setUser();

    this.email.valueChanges.subscribe((value) => {
      if (this.error.email && this.error.email !== value) {
        this.hasErrorEmail = false;
      } else this.hasErrorEmail = true;
    });
    this.username.valueChanges.subscribe((value) => {
      if (this.error.username && this.error.username !== value) {
        this.hasErrorName = false;
      } else {
        this.hasErrorName = true;
      }
    });
  }

  ngDoCheck(): void {
    this.setUser();
  }

  public setUser() {
    if (this.userService.user && this.userService.user.username && !this.user) {
      this.user = this.userService.user;
      this.isLoading = false;
      this.formUpdate.setValue({
        username: this.user.username,
        image: this.user.image,
        email: this.user.email,
        bio: this.user.bio,
        password: '',
      });
    }
  }

  updateProfile() {
    const body: UpdateUser = {
      user: {},
    };
    const userUpdate = { ...this.formUpdate.value };
    if (userUpdate.username !== this.user.username) {
      body.user.username = userUpdate.username;
    }
    if (userUpdate.email !== this.user.email)
      body.user.email = userUpdate.email;
    if (userUpdate.image !== this.user.image)
      body.user.image = userUpdate.image;
    if (userUpdate.password) body.user.password = userUpdate.password;
    if (userUpdate.bio !== this.user.bio) body.user.bio = userUpdate.bio;

    this.subscription.add(
      this.apiClient.updateUser(body).subscribe({
        next: (res: { user: User }) => {
          // this.updateProfile.reset();
          const url: string = `/profile/@${this.user.username}`
          this.router.navigate([url]);
        },
        error: (err) => {
          if (err.error.includes('username')) {
            this.hasErrorEmail = true;
            this.error.username = `'${body.user.username}' has been taken`;
          }
          if (err.error.includes('email')) {
            this.hasErrorName = true;
            this.error.email = `'${body.user.email}' has been taken`;
          }
        },
      })
    );
  }
  public handleLogout() {
    this.auth.logOut();
    const id = setTimeout(() => {
      this.router.navigate(['/home']);
      clearTimeout(id);
    }, 200)
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.isLoading = true;
  }
}
