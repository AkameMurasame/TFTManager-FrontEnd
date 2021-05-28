import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective  implements OnInit, OnDestroy {

  @Input() permission: string | undefined;

  private onDestroy$ = new Subject<boolean>();

  constructor(private authService: AuthenticationService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.authService.checkPermission(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    this.viewContainer.clear();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
