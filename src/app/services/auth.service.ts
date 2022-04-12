import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn: boolean = false;
  public TOKEN: string = '';
  public redirectUrl: string = '';
  public errorResponse!:HttpErrorResponse

  constructor() {
    this.getToken();
  }

  public setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
      this.isLoggedIn = true;
      this.TOKEN = token;
    }
    else this.logOut();
  }

  public getToken(): string | null {
    const token: string | null = localStorage.getItem('token');
    if (!token) this.setToken(null);
    return token;
  }

  public logOut() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.TOKEN = '';
  }
}
