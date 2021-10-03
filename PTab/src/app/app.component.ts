import { Component } from '@angular/core';
import { Globales } from './common/globales';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
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