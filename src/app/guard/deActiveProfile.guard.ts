import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { EditProfileComponent } from '../modules/profile/edit-profile/edit-profile.component';

@Injectable({
  providedIn: 'root',
})
export class DeActiveProfile implements CanDeactivate<EditProfileComponent> {
  constructor(public dialogService: DialogService) {}

  canDeactivate(
    component: EditProfileComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.formUpdate.valid) {
      return this.dialogService.confirm('Are you sure about this?');
    }
    return true;
  }
}
