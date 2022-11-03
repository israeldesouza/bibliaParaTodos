import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BibliaService } from '../../shared/services/biblia.service';
import { HomeResolve } from './home.resolve';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [HomeComponent, MenuComponent],
	imports: [CommonModule, HttpClientModule, FormsModule, HomeRoutingModule],
	providers: [HomeResolve, BibliaService],
})
export class HomeModule {}
