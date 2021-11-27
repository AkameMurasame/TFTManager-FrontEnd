import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { RouterModule } from '@angular/router';
import { PermissionDirective } from './directives/permission.directive';
import { ToastService } from './services/toast.service';
import { RiotModule } from '../@riotApi/riot.module';
import { HotToastModule } from '@ngneat/hot-toast';
import { ViewMatchComponent } from './components/view-match/view-match.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, ContentComponent, PermissionDirective, ViewMatchComponent],
  imports: [
    CommonModule,
    RouterModule,
    RiotModule,
    HotToastModule,
    MatTableModule
  ],
  exports: [SidebarComponent, NavbarComponent, ContentComponent, PermissionDirective],
  providers: [ToastService]
})
export class SharedModule { }
