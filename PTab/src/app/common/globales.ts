import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



declare global {
	var chrome: any;
}

export interface Image {
	name: string,
	image: string,
	id: number
}

export type SearchVerticalPosition = 'toptop' | 'top' | 'center' | 'bottom' | 'bottombottom';
export type SearchHorizontalPosition = 'leftleft' | 'left' | 'middle' | 'right' | 'rightright';

export interface Entry {
	title: string,
	url: string
}



@Injectable()
export class Globales {
	private db: IDBDatabase | undefined = undefined;
	private files: Image[] = [];
	private background: Image | undefined = undefined;
	private background_color: string = '#7f7f7f';

	// settings
	private random_image: boolean = false;
	private image_index: number = 0;
	private use_image: boolean = false;
	private show_search: boolean = true;
	private search_vertical_position: SearchVerticalPosition = 'center';
	private search_horizontal_position: SearchHorizontalPosition = 'middle';
	private search_engine: string = '';



	constructor(private router: Router) {
		let request = window.indexedDB.open('ptab', 1);
		let from = this;
		this.loadSettings();
		request.onsuccess = function() {
			from.db = request.result;
			from.loadDB();
		}
		request.onupgradeneeded = function(e: any) {
			let temp = e.target.result;
			let objectStore = temp.createObjectStore('ptab_os', {keyPath: 'id', autoIncrement: true});
			objectStore.createIndex('name', 'name', {unique: false});
			objectStore.createIndex('image', 'image', {unique: false});
		}
	}



	private loadBackground(): Image {
		if(this.random_image) {
			return this.files[Math.floor(Math.random()*this.files.length)];
		} else {
			for(let img of this.files)
				if(img.id == this.image_index)
					return img;
			return this.files[0];
		}
	}
	public getBackground(): Image | undefined {
		return this.background;
	}
	public getBackgroundColor(): string {
		return this.background_color;
	}



	public isRandom(): boolean {
		return this.random_image;
	}

	public setRandom(r: boolean): void {
		this.random_image = r;
		window.localStorage.setItem('random_image', r.toString());
	}



	public getImages(): Image[] {
		return this.files;
	}

	private getFilesNameList(): string {
		return this.files.map((val: Image) => val.name).join(',');
	}

	public getImage(name: string): string {
		for(let file of this.files)
			if(file.name == name)
				return file.image;
		return '';
	}

	public addImage(name: string, b64: string, reloadDB: boolean = true): Promise<boolean> {
		let temp_resolve: any;
		let p = new Promise<boolean>((resolve: any, reject: any) => {
			temp_resolve = resolve;
		});

		if(this.db != undefined) {
			let transaction = this.db.transaction(['ptab_os'], 'readwrite');
			let objectStore = transaction.objectStore('ptab_os');
			objectStore.add({name: name, image: b64});
			let from = this;
			transaction.oncomplete = function() {
				if(reloadDB)
					from.loadDB();
				temp_resolve(true);
			};
			transaction.onerror = function() {
				temp_resolve(false);
			}
		} else {
			setTimeout(() => {temp_resolve(false)}, 10);
		}
		return p;
	}

	public deleteImage(id: number): void {
		if(this.db != undefined && confirm('Remove this image ?')) {
			this.db.transaction(['ptab_os'], 'readwrite').objectStore('ptab_os').delete(id);
			this.loadDB();
		}
	}

	public selectImage(img: Image): void {
		this.random_image = false;
		this.background = img;
		this.setUseImage(true);
		window.localStorage.setItem('image_index', img.id.toString());
		window.localStorage.setItem('random_image', 'false');
	}



	public setShowSearch(show: boolean): void {
		this.show_search = show;
		window.localStorage.setItem('show_search', this.show_search.toString());
	}
	public showSearchBar(): boolean {
		return this.show_search;
	}
	public getSearchVerticalPosition(): SearchVerticalPosition {
		return this.search_vertical_position;
	}
	public getSearchHorizontalPosition(): SearchHorizontalPosition {
		return this.search_horizontal_position;
	}
	public setSearchPosition(h: SearchHorizontalPosition, v: SearchVerticalPosition): void {
		this.search_horizontal_position = h;
		this.search_vertical_position = v;
		window.localStorage.setItem('search_horizontal_position', this.search_horizontal_position);
		window.localStorage.setItem('search_vertical_position', this.search_vertical_position);
	}



	private loadDB(): void {
		if(this.db != undefined) {
			let objectStore = this.db.transaction('ptab_os').objectStore('ptab_os');
			let from = this;
			this.files = [];
			objectStore.openCursor().onsuccess = function(e: Event) {
				let cursor = (<IDBRequest> e.target).result;
				if(cursor) {
					from.files.push({
						name: cursor.value.name,
						image: cursor.value.image,
						id: cursor.value.id
					});
					cursor.continue()
				} else {
					from.background = from.loadBackground();
				}
			}
		}
	}



	private loadSettings(): void {
		let s = window.localStorage;
		{
			let temp = parseInt(s.getItem('image_index') + '');
			if(isNaN(temp))
				this.image_index = 0;
			else
				this.image_index = temp;
		}

		this.random_image = s.getItem('random_image') === 'true';
		this.background_color = s.getItem('background_color') + '';
		this.use_image = s.getItem('use_image') === 'true';

		{
			let temp = s.getItem('search_vertical_position');
			this.search_vertical_position = <SearchVerticalPosition> (temp != null ? temp : 'center');
		}
		{
			let temp = s.getItem('search_horizontal_position');
			this.search_horizontal_position = <SearchHorizontalPosition> (temp != null ? temp : 'middle');
		}
		{
			let temp = s.getItem('show_search');
			this.show_search = <boolean> (temp != null ? temp == 'true' : true);
		}
		{
			let temp = s.getItem('search_engine');
			this.search_engine = <string> (temp != null ? temp : 'google');
		}
	}



	public getSearchEngine(): string {
		return this.search_engine;
	}
	public setSearchEngine(val: string): void {
		this.search_engine = val;
		window.localStorage.setItem('search_engine', val);
	}



	public useImage(): boolean {
		return this.use_image;
	}

	public setUseImage(use: boolean): void {
		this.use_image = use;
		window.localStorage.setItem('use_image', use.toString());
	}



	public setBackgroundColor(c: string): void {
		this.background_color = c;
		window.localStorage.setItem('background_color', c);
	}



	public getHistory(search: string): Promise<Entry[]> {
		let r: any;
		new Promise<string[]>((resolve: any, reject: any) => {
			r = resolve;
		});
		chrome.history?.search({text: search, maxResults: 10}, (data: any) => {
			r.resolve(data.map((val: any) => {
				return {
					title: val.url,
					url: val.url
				};
			}));
		});
		return r;
	}



	public navigateTo(url: string): void {
		this.router.navigate([url]);
	}
}