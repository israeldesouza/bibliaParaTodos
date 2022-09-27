import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ETheme } from '../enum/theme-enum';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	themeSubject = new BehaviorSubject<ETheme>(this.getThemeLocalStorage());

	public changeTheme(theme: ETheme): void {
		this.setThemeLocalStorage(theme);
		this.themeSubject.next(theme);
	}

	public getTheme(): Observable<ETheme> {
		return this.themeSubject.asObservable();
	}

	private setThemeLocalStorage(theme: ETheme) {
		window.localStorage.setItem('theme', theme);
	}

	private getThemeLocalStorage(): ETheme {
		return (window.localStorage.getItem('theme') as ETheme) || ETheme.LIGTH;
	}
}
