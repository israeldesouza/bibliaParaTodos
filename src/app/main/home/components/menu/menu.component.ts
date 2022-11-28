import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit,
	OnDestroy,
} from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

import { ETheme } from 'src/app/shared/enum/theme-enum';
import {
	ILivroSelected,
	IMenuBiblia,
} from 'src/app/shared/models/menu-biblia.interface';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { IChapter } from './../../../../shared/models/menu-biblia.interface';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
	private _subs: Subscription[] = [];

	theme: ETheme = ETheme.LIGTH;
	@Input() menuBiblia: IMenuBiblia[] = [];
	chapters: IChapter[] = [];
	versesNumber: number[] = [];

	eTheme = ETheme;

	@Output() onSelectedLivro = new EventEmitter<ILivroSelected>();
	@Output() onChangeFontSize = new EventEmitter<number>();

	private _debounceSearch: Subject<string> = new Subject<string>();

	@Input() livroSelected: ILivroSelected = {
		livro: null,
		chapter: null,
		verse: null,
		size: 16,
	};

	expanded: boolean = false;
	showCapters: boolean = false;
	private _searchText!: string;

	maxFontSize = 24;

	constructor(private _themeService: ThemeService) {
		_themeService.getTheme().subscribe({
			next: (res: ETheme) => (this.theme = res),
			error: (e) => console.error('Get theme not found!!!'),
		});
	}

	ngOnInit(): void {
		this._subs.push(
			this._debounceSearch
				.pipe(debounceTime(800))
				.subscribe((value) => (this._searchText = value))
		);
	}

	ngOnDestroy(): void {
		this._subs.forEach((subs) => subs.unsubscribe());
	}

	public expandedMenu(): void {
		this.expanded = !this.expanded;
	}

	public selectBook(livro: string): void {
		this.livroSelected = {
			chapter:
				this.livroSelected.livro === livro ? this.livroSelected.chapter : 0,
			livro,
			verse: null,
			size: this.livroSelected.size,
		};

		this.chapters =
			this.menuBiblia.find((menu) => menu.livro === livro)?.chapter || [];

		this.onSelectedLivro.next(this.livroSelected);

		this.showCapters = true;
	}

	public selectChapter(chapter: number): void {
		this.livroSelected.chapter = chapter;

		this.livroSelected = { ...this.livroSelected, chapter, verse: null };

		this.versesNumber = this.chapters[chapter].versesNumber;

		this.onSelectedLivro.next(this.livroSelected);

		this.expandedMenu();
	}

	public selectVerse(verse: number): void {
		this.livroSelected = { ...this.livroSelected, verse };

		this.onSelectedLivro.next(this.livroSelected);
	}

	public comeBack(): void {
		this._searchText = '';
		this.showCapters = false;
	}

	public changeTheme(newTheme: ETheme) {
		this._themeService.changeTheme(newTheme);
	}

	public plusSize(): void {
		if (this.livroSelected.size === this.maxFontSize) return;
		this.livroSelected.size += 1;

		this.onChangeFontSize.emit(this.livroSelected.size);
	}

	public anyLessSize(): void {
		if (this.livroSelected.size === 16) return;
		this.livroSelected.size -= 1;

		this.onChangeFontSize.emit(this.livroSelected.size);
	}

	public searchBooks(event: any): void {
		this._debounceSearch.next(event.value);
	}

	public filterBooks(): IMenuBiblia[] {
		if (!this._searchText) return this.menuBiblia;
		return this.menuBiblia.filter((book) =>
			book.livro
				.toLocaleUpperCase()
				.includes(this._searchText.toLocaleUpperCase())
		);
	}
}
