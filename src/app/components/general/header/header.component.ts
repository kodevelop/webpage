import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  themeToggle: HTMLInputElement | undefined;
  isScrolled = false;

  ngOnInit(): void {
    this.themeToggle = document.getElementById(
      'theme-toggle'
    ) as HTMLInputElement;
    this.themeToggle.addEventListener('change', () => {
      if (this.themeToggle?.checked) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const offset =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (offset > 0 && !this.isScrolled) {
      this.isScrolled = true;
    } else if (offset === 0 && this.isScrolled) {
      this.isScrolled = false;
    }
  }
}
