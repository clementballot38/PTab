import { Component, OnInit } from '@angular/core';
import { Globales, SearchPosition } from '../common/globales';



@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
	public url: string = '';



	constructor(private globales: Globales) {
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		(<HTMLInputElement>document.querySelector('#searchbar'))!.focus();
	}
	


	public search(event: KeyboardEvent): void {
		if(event.key == 'Enter') {
			if(this.isURL()) {
				window.location.assign('https://' + this.url);
			} else {
				window.location.assign('https://www.google.com/search?q=' + this.url)
			}
		}
	}



	public getSearchPosition(): SearchPosition {
		return this.globales.getSearchPosition();
	}



	private isURL(): boolean {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(this.url);
	}



	public openSettings(): void {
		this.globales.navigateTo('settings');
	}
}