import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/players'; 

  constructor(private http: HttpClient) {}

  
  getPlayers(limit: number = 16, page: number = 1, club: string = '', position: string = '', name: string = ''): Observable<any[]> {
    let params: any = {
      limit: limit.toString(),
      page: page.toString(),
    };

    if (club) {
      params.club = club;
    }
    if (position) {
      params.position = position;
    }
    if (name) {
      params.name = name;
    }

    return this.http.get<any[]>(`${this.apiUrl}`, { params });
  }

  
  getPlayerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPlayer(playerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, playerData);
  }

  updatePlayer(id: number, playerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, playerData);
  }


  getPlayersWithFilters(name: string, club: string, position: string): Observable<any[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (club) params = params.set('club', club);
    if (position) params = params.set('position', position);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

}


