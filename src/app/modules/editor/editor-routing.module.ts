import { CanDeActiveGuard } from './../../guard/can-deactive.guard';
import { EditorComponent } from './editor/editor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { EditArticleComponent } from './edit-article/edit-article.component';

const routes: Routes = [
  { path: 'article/:slug', component: ArticleDetailComponent },
  {
    path: 'new-article',
    component: EditArticleComponent,
    canDeactivate: [CanDeActiveGuard],
  },
  {
    path: 'edit-article/:slug',
    component: EditorComponent,
    canDeactivate: [CanDeActiveGuard],
  },
  { path: '', redirectTo: 'article', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
