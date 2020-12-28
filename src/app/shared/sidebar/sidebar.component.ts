import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {AppState} from '../../app.reducer';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;
  userSubs = Subscription;

  constructor(private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter( user => user.user != null)
      )
      .subscribe(user => this.nombre = user.user.nombre);
  }

  logout(): void {
    this.authService.logout().then(() => {
       this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsusbcribe();
  }
}
