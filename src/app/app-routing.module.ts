import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/Home/pages/home/home.component';
import { PlayerComponent } from './features/Music/Player/pages/player/player.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', component: PlayerComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
