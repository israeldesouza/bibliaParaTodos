import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';

import {
	BibliaService,
	IBibliaResponse,
} from './../../shared/services/biblia.service';
import {
	IMenuBiblia,
	ILivroSelected,
} from './../../shared/models/menu-biblia.interface';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	menuBiblia: IMenuBiblia[] = [];
	book!: IBibliaResponse;

	bookSelected: ILivroSelected = {
		livro: 'Gênesis',
		chapter: 0,
		verse: 0,
		size: 16,
	};

	constructor(
		private _route: ActivatedRoute,
		private _bibliaService: BibliaService,
		readonly themeService: ThemeService
	) {}

	ngOnInit(): void {
		this.menuBiblia = this._route.snapshot.data['menuBiblia'] || [];

		const lastSelectedBook = this._bibliaService.getLastSelectedBook();
		if (lastSelectedBook) this.bookSelected = lastSelectedBook;
		this.getBook(this.bookSelected);
	}

	public getBook(args: ILivroSelected): void {
		this._bibliaService.getBiblia(args).subscribe({
			next: (res: IBibliaResponse) => {
				this.book = res;
				this.bookSelected = args;
				this.saveLastSelectedBook();
			},
			error: (e) => console.error('Livro Não encontrado!!!'),
		});
	}

	public bookChangeSelectedSize(event: number): void {
		this.bookSelected.size = event;

		this.saveLastSelectedBook();
	}

	public saveLastSelectedBook(): void {
		this._bibliaService.saveLastSelectedBook(this.bookSelected);
	}
}
