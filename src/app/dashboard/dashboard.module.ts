import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { HttpModule } from '@angular/http';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

import { InstagramService } from '../core/services/instagram.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        HttpModule,
        MdModule
    ],
    declarations: [DashboardComponent],
    providers: [
        InstagramService
    ]
})

export class DashboardModule {}
