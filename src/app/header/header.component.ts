import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../Models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, DoCheck {
  public isLoggedIn: boolean = false;
  public user!: User | null;


  @ViewChild('navbar') navElement!: ElementRef;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) this.isLoggedIn = true;
    else this.isLoggedIn = false;
    if (this.userService.user && this.userService.user.username) {
      this.user = this.userService.user;
    }
  }

  public handleActiveNavbar() {
    if (this.navElement) {
      this.navElement.nativeElement.classList.toggle('active');
    }
  }

  public changeUserPage(username: string | undefined) {
    if (username) {
      return `/profile/@${username}`
    }
    else return '/'
  }

  ngDoCheck(): void {
    if (
      this.isLoggedIn !== this.authService.isLoggedIn ||
      (!this.user && this.isLoggedIn)
    ) {
      this.isLoggedIn = this.authService.isLoggedIn;
      this.user = this.userService.user;
    }
    else if (!this.authService.isLoggedIn){
      this.user = null;
    }
  }
}
