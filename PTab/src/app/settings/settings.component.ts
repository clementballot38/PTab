import { Component, OnInit } from '@angular/core';
import { Globales, Image, SearchVerticalPosition, SearchHorizontalPosition } from '../common/globales';



interface MenuItem {
	name: string,
	url: string,
	icon?: string
}



@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})



export class SettingsComponent implements OnInit {
	private state: string = '';



	private menu_items: MenuItem[] = [
		{ name: 'General', url: '', icon: 'home' },
		{ name: 'Images', url: 'images', icon: 'image' },
		{ name: 'About', url: 'about', icon: 'about' }
	];



	constructor(private globales: Globales) {
	}

	ngOnInit(): void {

	}



	public openFileDialog(): void {
		(<HTMLInputElement> document.querySelector('#file_input'))!.click();
	}
	public async selectFile(event: Event) {
		let files = (<HTMLInputElement> event.target)!.files!;
		for(let i=0; i<files.length; i++) {
			let file = files[i];
			if(file.type.match(/image-*/)) {
				let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = e => {
					this.globales.addImage(file.name, <string> e.target!.result, i==files.length-1);
				}
			}
		}
	}



	public delete(img: Image): void {
		this.globales.deleteImage(img.id);
	}



	public getImages(): Image[] {
		return this.globales.getImages();
	}



	public goto(url: string): void {
		this.state = url;
	}
	public getState(): string {
		return this.state;
	}



	public isSelected(img: Image): boolean {
		if(this.globales.getBackground() != undefined && !this.globales.isRandom() && this.globales.useImage())
			return img.id == this.globales.getBackground()!.id;
		else
			return false;
	}

	public isRandom(): boolean {
		return this.globales.isRandom();
	}

	public setRandom(event: boolean): void {
		this.globales.setRandom(event);
	}



	public selectImage(img: Image): void {
		this.globales.selectImage(img);
	}



	public getMenuItems(): MenuItem[] {
		return this.menu_items;
	}



	public useImage(): boolean {
		return this.globales.useImage();
	}

	public setUseImage(ev: boolean): void {
		this.globales.setUseImage(ev);
	}



	public setBackgroundColor(ev: Event): void {
		this.globales.setBackgroundColor((<HTMLInputElement>ev.target).value);
	}
	public getBackgroundColor(): string {
		return this.globales.getBackgroundColor();
	}



	public setSearchPosition(h: SearchHorizontalPosition, v: SearchVerticalPosition): void {
		this.globales.setSearchPosition(h, v);
	}



	public getVerticalPositions(): SearchVerticalPosition[] {
		return ['toptop', 'top', 'center', 'bottom', 'bottombottom'];
	}
	public getHorizontalPositions(): SearchHorizontalPosition[] {
		return ['leftleft', 'left', 'middle', 'right', 'rightright'];
	}

	public selectedPosition(h: SearchHorizontalPosition, v: SearchVerticalPosition): string {
		return h==this.globales.getSearchHorizontalPosition() && v==this.globales.getSearchVerticalPosition() ? 'selected' : '';
	}



	private getIndex(val: string, tab: string[]): number {
		for(let i=0; i<tab.length; i++)
			if(tab[i] == val)
				return i;
		return 0;
	}



	public close(): void {
		this.globales.navigateTo('');
	}
}