import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial-screen',
  templateUrl: './initial-screen.component.html',
  styleUrl: './initial-screen.component.scss'
})
export class InitialScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
