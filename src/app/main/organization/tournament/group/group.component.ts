import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  dataSource: any; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: { group: any }) { }

  ngOnInit(): void {

  }

}
