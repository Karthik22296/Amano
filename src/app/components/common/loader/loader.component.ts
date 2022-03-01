import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private loaderService:LoaderService) { 
    console.log(this.loaderService.loading$)
  }
  loading$ = this.loaderService.loading$;
  ngOnInit(): void {
  }

}
