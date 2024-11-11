import { Component, HostListener, OnInit } from '@angular/core';
import { PlayerService } from '../players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players: any[] = []; 

  filteredPlayers: any[] = []; 
  loading: boolean = true;
  currentPage: number = 1;
  limit: number = 21;
  selectedPlayer: any = null;
  searchTerm: string = ''; 
  selectedClub: string = ''; 
  selectedPosition: string = ''; 
  clubs: string[] = []; 
  positions: string[] = []; 

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers() {
    this.loading = true;
    this.playerService.getPlayers(this.limit, this.currentPage).subscribe({
      next: (data) => {
        console.log('Jugadores cargados:', data);
        this.players = data;
        this.filteredPlayers = this.filterPlayers(data); 
        this.players = this.filteredPlayers.slice(0, this.limit); 
        this.loading = false;

        this.clubs = [...new Set(data.map(player => player.club_name))];
        this.positions = [...new Set(data.map(player => player.player_positions))];
      },
      error: (err) => {
        console.error('Error al cargar los jugadores', err);
        this.loading = false;
      }
    });
  }

  filterPlayers(players: any[]): any[] {
    return players.filter(player => {
      return (
        (this.searchTerm ? player.long_name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true) &&
        (this.selectedClub ? player.club_name === this.selectedClub : true) &&
        (this.selectedPosition ? player.player_positions.includes(this.selectedPosition) : true)
      );
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPlayers();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadPlayers();
  }

 

  selectPlayer(player: any): void {
    this.selectedPlayer = player;
  }

  deselectPlayer(): void {
    this.selectedPlayer = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const playerDetailModal = document.querySelector('.player-detail-modal');
    if (this.selectedPlayer && playerDetailModal && !playerDetailModal.contains(event.target as Node)) {
      this.deselectPlayer();
    }
  }

  editPlayer(playerId: number): void {
    this.router.navigate(['/edit-player', playerId]);
  }

  
  onFilterChange(): void {
    this.filteredPlayers = this.filterPlayers(this.players);
    this.currentPage = 1;  
    this.loadPlayers();  
  }
}