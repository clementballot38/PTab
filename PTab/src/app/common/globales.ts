import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



export interface Image {
	name: string,
	image: string,
	id: number
}

export type SearchPosition = 'toptop' | 'top' | 'center' | 'bottom' | 'bottombottom';



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
	private search_position: SearchPosition = 'center';



	constructor(private router: Router) {
		let request = window.indexedDB.open('ptab', 1);
		let from = this;
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



	public getSearchPosition(): SearchPosition {
		return this.search_position;
	}
	public setSearchPosition(p: SearchPosition): void {
		this.search_position = p;
		window.localStorage.setItem('search_position', this.search_position);
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
					from.loadSettings();
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
			let temp = s.getItem('search_position');
			this.search_position = <SearchPosition> (temp != null ? temp : 'center');
		}
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



	public navigateTo(url: string): void {
		this.router.navigate([url]);
	}
}