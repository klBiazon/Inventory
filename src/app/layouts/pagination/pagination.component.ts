import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutsService } from '../layouts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit, OnDestroy {

  pagination;
  totalCount;
  dataLength;
  private countSubs: Subscription;

  isLoggedIn;
  private authListenerSubs: Subscription;

  constructor(private layoutsService: LayoutsService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.countSubs = this.layoutsService.getCountPaginationListener()
      .subscribe(pagination => {
        this.totalCount = pagination.totalCount;
        this.dataLength = pagination.dataLength;
      });
    this.pagination = this.layoutsService.getPagination();
    this.paginationCall();
    
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.isLoggedIn = res.isAuthenticated;
      });
    this.isLoggedIn = this.authService.getIsAuth();
  }

  ngOnDestroy() {
    this.countSubs.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  paginationCall() {
    this.layoutsService.setPaginationEvent(this.pagination);
  }
}
