import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ArticleItemComponent } from './article-item/article-item.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent, ArticleItemComponent, EditProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, FormsModule, ReactiveFormsModule],
})
export class ProfileModule {}
