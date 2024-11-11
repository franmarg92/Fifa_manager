import { Component, HostListener, OnInit } from '@angular/core';
import { PlayerService } from '../players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-filter',
  templateUrl: './player-filter.component.html',
  styleUrls: ['./player-filter.component.css']
})
export class PlayerFilterComponent implements OnInit {

  // Filtros
  searchTerm: string = '';
  selectedClub: string = '';
  selectedPosition: string = '';
  filteredPlayers: any[] = []; 
  loading: boolean = false;
  currentPage: number = 1; 
  playersPerPage: number = 10; 
  selectedPlayer: any = null;


  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    
    this.filteredPlayers = [];
  }

  
  applyFilters(): void {
    
    if (!this.searchTerm && !this.selectedClub && !this.selectedPosition) {
      this.filteredPlayers = [];
      return;
    }

    this.loading = true;
    this.playerService
      .getPlayersWithFilters(this.searchTerm, this.selectedClub, this.selectedPosition)
      .subscribe({
        next: (data) => {
          this.filteredPlayers = this.paginatePlayers(data); 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al aplicar filtros', err);
          this.loading = false;
        }
      });
  }

  
  paginatePlayers(players: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.playersPerPage;
    return players.slice(startIndex, startIndex + this.playersPerPage);
  }

  
  nextPage(): void {
    this.currentPage++;
    this.applyFilters();
  }

  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  selectPlayer(player: any): void {
    this.selectedPlayer = player;
    console.log('Jugador seleccionado:', this.selectedPlayer);
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
}
