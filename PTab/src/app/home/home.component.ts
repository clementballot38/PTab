import { Component, OnInit } from '@angular/core';
import { Globales, SearchVerticalPosition, SearchHorizontalPosition, Entry } from '../common/globales';



@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
	public url: string = '';
	private history: Entry[] = [];



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
				switch(this.globales.getSearchEngine())
				{
					case 'bing':
						window.location.assign('https://www.bing.com/search?q=' + this.url.replace(' ', '+'));
						break;

					case 'duckduckgo':
						window.location.assign('https://duckduckgo.com/?q=' + this.url.replace(' ', '+'));
						break;

					case 'ecosia':
						window.location.assign('https://www.ecosia.org/search?q=' + this.url.replace(' ', '+'));
						break;

					case 'brave':
						window.location.assign('https://search.brave.com/search?q=' + this.url.replace(' ', '+'));
						break;

					case 'google':
					default:
						window.location.assign('https://www.google.com/search?q=' + this.url);
						break;
				}
				
			}
		} else {
			/*this.globales.getHistory(this.url).then((results: Entry[]) => {
				this.history = results;
			});*/
		}
	}



	public showSearchBar(): boolean {
		return this.globales.showSearchBar();
	}
	public getSearchVerticalPosition(): SearchVerticalPosition {
		return this.globales.getSearchVerticalPosition();
	}
	public getSearchHorizontalPosition(): SearchHorizontalPosition {
		return this.globales.getSearchHorizontalPosition();
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