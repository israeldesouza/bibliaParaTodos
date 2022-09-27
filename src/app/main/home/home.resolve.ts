import { BibliaService } from './../../shared/services/biblia.service';
import { IMenuBiblia } from './../../shared/models/menu-biblia.interface';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class HomeResolve implements Resolve<IMenuBiblia[]> {
	constructor(private _bibliaService: BibliaService) {}

	resolve(): Observable<IMenuBiblia[]> {
		return this._bibliaService.getMenuBiblia();
	}
}
