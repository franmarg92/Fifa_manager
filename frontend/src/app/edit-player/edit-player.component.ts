import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../players.service';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css']
})
export class EditPlayerComponent implements OnInit {
  playerId: number | undefined;  
  player: any = {};

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.playerId = +params.get('id')!;  
      this.loadPlayerDetails();           
    });
  }

  loadPlayerDetails(): void {
    if (this.playerId) {
      this.playerService.getPlayerById(this.playerId).subscribe({
        next: (data) => {
          this.player = data;
        },
        error: (err) => {
          console.error('Error al cargar los detalles del jugador', err);
        }
      });
    }
  }

  savePlayer(): void {
    if (this.playerId) {
      this.playerService.updatePlayer(this.playerId, this.player).subscribe({
        next: () => {
          
          this.router.navigate(['/players']);  
        },
        error: (err) => {
          console.error('Error al guardar cambios', err);
          alert('Hubo un error al actualizar el jugador');
        }
      });
    }
  }
}
