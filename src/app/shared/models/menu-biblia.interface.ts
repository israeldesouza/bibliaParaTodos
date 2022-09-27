export interface IMenuBiblia {
	livro: string;
	chapter: IChapter[];
}

export interface IChapter {
	chapterNumber: number;
	versesNumber: number[];
}

export interface ILivroSelected {
	livro: string | null;
	chapter: number | null;
	verse: number | null;
	size: number;
}
