import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';




export type SpinnerOption =
{
	name: string,
	value: string,
	default?: boolean
}


@Component({
	selector: 'spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.css']
})



export class SpinnerComponent implements OnInit {
	@Input() options: SpinnerOption[] = [
		{ name: "Change this 1", value: "option1" },
		{ name: "Change this 2", value: "option2" }
	];
	@Output() value: EventEmitter<string> = new EventEmitter<string>();
	private is_open: boolean = false;
	private current: SpinnerOption = { name: 'default', value: 'default' };


	@HostListener('document:click', ['$event'])
	clickout(event: Event)
	{
		if(!this.eRef.nativeElement.contains(event.target))
			this.is_open = false;
	}



	constructor(private eRef: ElementRef) {
	}

	ngOnInit(): void {
		let defaults: SpinnerOption[] = this.options.filter((val: SpinnerOption) => {
			return val.default != undefined ? val.default : false;
		});
		if(defaults.length > 0)
			this.select(defaults[0]);
		else if(this.options.length > 0)
			this.select(this.options[0]);
	}



	public getCurrent(): string
	{
		return this.current.name;
	}


	public getOptions(): SpinnerOption[]
	{
		return this.options;
	}

	public select(val: SpinnerOption): void
	{
		this.current = val;
		this.value.emit(val.value);
		this.is_open = false;
	}



	public isSelected(val: SpinnerOption): boolean
	{
		return this.current.value == val.value;
	}



	public isOpen(): boolean
	{
		return this.is_open;
	}

	public open(): void
	{
		this.is_open = !this.is_open;
	}
}
