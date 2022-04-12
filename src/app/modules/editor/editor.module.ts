import { EditorComponent } from './editor/editor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { EditorRoutingModule } from './editor-routing.module';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [EditorComponent, ArticleDetailComponent, EditArticleComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSkeletonLoaderModule
  ]
})
export class EditorModule { }
