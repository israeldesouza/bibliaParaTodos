import { ThemeService } from 'src/app/shared/services/theme.service';
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<div class="content-body {{ themeService.getTheme() | async }}">
			<router-outlet></router-outlet>
		</div>
	`,
	styles: [
		`
			@import '../scss/colors.scss';
			.content-body {
				width: 100%;
				min-height: 100vh;

				&.dark {
					background: $dark-mode-color;
				}
			}
		`,
	],
})
export class AppComponent {
	constructor(readonly themeService: ThemeService) {}
}
