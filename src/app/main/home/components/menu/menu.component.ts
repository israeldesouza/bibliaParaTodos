import {
	Component,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from '@angular/core';
import { throwError } from 'rxjs';

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
export class MenuComponent {
	theme: ETheme = ETheme.LIGTH;
	@Input() menuBiblia: IMenuBiblia[] = [];
	chapters: IChapter[] = [];
	versesNumber: number[] = [];

	eTheme = ETheme;

	@Output() onSelectedLivro = new EventEmitter<ILivroSelected>();
	@Output() onChangeFontSize = new EventEmitter<number>();

	@Input() livroSelected: ILivroSelected = {
		livro: null,
		chapter: null,
		verse: null,
		size: 16,
	};

	expanded = false;
	btnBack = false;

	maxFontSize = 24;

	constructor(private _themeService: ThemeService) {
		_themeService.getTheme().subscribe({
			next: (res: ETheme) => (this.theme = res),
			error: (e) => throwError('Get theme not found!!!'),
		});
	}

	public expandedMenu(): void {
		this.expanded = !this.expanded;
	}

	public selectBook(livro: string): void {
		if (!livro) return;

		this.livroSelected = {
			livro,
			chapter: null,
			verse: null,
			size: this.livroSelected.size,
		};

		this.chapters =
			this.menuBiblia.find((menu) => menu.livro === livro)?.chapter || [];

		this.onSelectedLivro.next(this.livroSelected);

		this.btnBack = true;
	}

	public selectChapter(chapter: number): void {
		this.livroSelected.chapter = chapter;

		this.livroSelected = { ...this.livroSelected, chapter, verse: null };

		this.versesNumber = this.chapters[chapter].versesNumber;

		this.onSelectedLivro.next(this.livroSelected);
	}

	public selectVerse(verse: number): void {
		this.livroSelected = { ...this.livroSelected, verse };

		this.onSelectedLivro.next(this.livroSelected);
	}

	public comeBack(): void {
		this.btnBack = false;
	}

	@HostListener('document:click', ['$event'])
	clickout(event: any): void {
		if (
			!event.path.some((element: HTMLElement) =>
				element?.className?.includes('menu-rigth')
			)
		) {
			this.expanded = false;
		}
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
}
