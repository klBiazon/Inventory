import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutsService } from '../layouts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  private isLoadingListenerSubs: Subscription;

  constructor(private layoutsService: LayoutsService) { }

  ngOnInit(): void {
    this.isLoadingListenerSubs = this.layoutsService.getIsLoadingListener()
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
    this.isLoading = this.layoutsService.getIsLoading();
  }

  ngOnDestroy(): void {
    this.isLoadingListenerSubs.unsubscribe();
  }
}
