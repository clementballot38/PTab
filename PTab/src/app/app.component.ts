import { Component } from '@angular/core';
import { Globales } from './common/globales';



declare global {
	var chrome: any;
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {


	constructor(private globales: Globales) {
		
	}



	public displayImage(): boolean {
		return (this.globales.getBackground() != undefined ? this.globales.useImage() : false);
	}



	public getImage(): string {
		if(this.displayImage() != undefined)
			return this.globales.getBackground()!.image;
		else
			return '';
	}

	public getBackgroundColor(): string {
		return this.globales.getBackgroundColor();
	}
}