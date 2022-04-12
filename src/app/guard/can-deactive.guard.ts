import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { EditArticleComponent } from '../modules/editor/edit-article/edit-article.component';
import { DialogService } from '../services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class CanDeActiveGuard implements CanDeactivate<EditArticleComponent> {
  constructor(public dialogService: DialogService) {}

  canDeactivate(
    component: EditArticleComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.newArticle.valid) {
      return this.dialogService.confirm('Are you sure about this?');
    }
    return true;
  }
}
