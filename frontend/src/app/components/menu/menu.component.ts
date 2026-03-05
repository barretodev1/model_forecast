import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  user: UserProfile | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfiles().subscribe(profiles => {
      this.user = profiles[0] || null;
    });
  }
}
