import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { RouterModule } from '@angular/router';
import { PermissionDirective } from './directives/permission.directive';
import { ToastService } from './services/toast.service';
import { RiotModule } from '../@riotApi/riot.module';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, ContentComponent, PermissionDirective],
  imports: [
    CommonModule,
    RouterModule,
    RiotModule
  ],
  exports: [SidebarComponent, NavbarComponent, ContentComponent, PermissionDirective]
})
export class SharedModule { }
