import { ArticleItemComponent } from './article-item/article-item.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TagComponent } from './tag/tag.component';
import { ArticleComponent } from './article/article.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    ArticleComponent,
    ArticleItemComponent,
    TagComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
