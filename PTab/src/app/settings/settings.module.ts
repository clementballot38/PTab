import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

import { SwitchModule } from '../switch/switch.module';
import { SpinnerModule } from '../spinner/spinner.module';



@NgModule({
	declarations: [
		SettingsComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SettingsRoutingModule,
		SwitchModule,
		SpinnerModule
	]
})
export class SettingsModule { }