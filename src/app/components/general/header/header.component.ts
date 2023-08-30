import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  themeToggle: HTMLInputElement | undefined;

  ngOnInit(): void {
    this.themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    this.themeToggle.addEventListener('change', () => {
      if (this.themeToggle?.checked) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }
}
