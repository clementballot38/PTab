import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SwitchRoutingModule } from './switch-routing.module';
import { SwitchComponent } from './switch.component';



@NgModule({
	declarations: [
		SwitchComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SwitchRoutingModule
	],
	exports: [
		SwitchComponent
	]
})
export class SwitchModule { }