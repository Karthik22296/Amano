import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
@Input() data;
@Input() pack;
  ngOnInit(): void {
  }
  print() {
    console.log(this.data)
    window.print();
  }

}
