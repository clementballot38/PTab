import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';



@Component({
	selector: 'toggle-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.css']
})



export class SwitchComponent implements OnInit {
	@Input() state: boolean = false;
	@Output() value: EventEmitter<boolean> = new EventEmitter<boolean>();



	constructor() {
	}

	ngOnInit(): void {

	}



	public toggle(): void {
		this.state = !this.state;
		this.value.emit(this.state);
	}

	public on(): string {
		return this.state.toString();
	}
}
