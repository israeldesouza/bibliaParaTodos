import { ILivroSelected } from './../models/menu-biblia.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { IMenuBiblia } from '../models/menu-biblia.interface';
import { IBiblia } from '../models/biblia.interface';

@Injectable()
export class BibliaService {
	private _menuBibliajsonURL = 'assets/menuBiblia.json';
	private _bibliajsonURL = 'assets/biblia.json';

	constructor(private _http: HttpClient) {}

	getMenuBiblia(): Observable<IMenuBiblia[]> {
		return this._http.get<IMenuBiblia[]>(this._menuBibliajsonURL);
	}

	getBiblia(args: ILivroSelected): Observable<IBibliaResponse> {
		return this._http
			.get<IBiblia[]>(this._bibliajsonURL)
			.pipe(map((biblia) => this.handlerBookChapter(biblia, args)));
	}

	private handlerBookChapter(
		biblia: IBiblia[],
		args: ILivroSelected
	): IBibliaResponse {
		const book = biblia.find((book) => book.name === args.livro);
		return {
			name: book?.name || 'Gênesis',
			chapter: book?.chapters[args.chapter || 0] || [],
		};
	}

	public saveLastSelectedBook(args: ILivroSelected): void {
		window.localStorage.setItem('lastBook', JSON.stringify(args));
	}

	public getLastSelectedBook(): ILivroSelected | null {
		const book = window.localStorage.getItem('lastBook');

		if (!book) return null;

		return JSON.parse(book) as ILivroSelected;
	}
}

export interface IBibliaResponse {
	name: string;
	chapter: { verse: string }[];
}
