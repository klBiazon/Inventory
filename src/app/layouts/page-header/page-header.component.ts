import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutsService } from '../layouts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Page } from '../../constants/page.constants';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.less']
})
export class PageHeaderComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  private pageHeaderSubs: Subscription;
  pageHeader: string;

  isLoggedIn: boolean = false;
  private authListenerSubs: Subscription;

  page = Page;

  constructor(private layoutsService: LayoutsService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoggedIn = authStatus.isAuthenticated;
      });
    this.isLoggedIn = this.authService.getIsAuth();
  }

  ngAfterViewInit() {
    this.pageHeaderSubs = this.layoutsService.getPageHeaderListener()
      .subscribe(value => {
        this.pageHeader = value;
      });
    this.pageHeader = this.layoutsService.getPageHeader();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.pageHeaderSubs.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
