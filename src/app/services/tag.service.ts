import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  public tag: string = '';
  constructor() {}
}
