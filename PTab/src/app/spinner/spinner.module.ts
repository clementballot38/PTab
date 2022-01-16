import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerRoutingModule } from './spinner-routing.module';
import { SpinnerComponent } from './spinner.component';



@NgModule({
	declarations: [
		SpinnerComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SpinnerRoutingModule
	],
	exports: [
		SpinnerComponent
	]
})
export class SpinnerModule { }