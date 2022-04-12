import { User } from './../Models';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user!: User;

  constructor() {}

}
