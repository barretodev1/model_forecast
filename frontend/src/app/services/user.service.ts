import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentSupabase } from "../environments/environment";

export interface UserProfile {   // <-- use interface ou type, mas com export
  id: string;
  name: string;
  avatar_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private API_URL = environmentSupabase.supabaseUrl;

  getProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.API_URL}/rest/v1/combined_profiles`, {
      headers: {
        'apikey': environmentSupabase.apiKey,
        'Authorization': `Bearer ${environmentSupabase.anonKey}`
      }
    });
  }
}
