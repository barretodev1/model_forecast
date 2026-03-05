import { Injectable } from "@angular/core"
import { CanActivate } from "@angular/router";
import { supabase } from "./supabase.service"

@Injectable({ providedIn: 'root' })

export class AuthService {

    async canActivate(): Promise<boolean> {
        const { data } = await supabase.auth.getSession();
        return !!data.session;
    }

    async loginWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
    }

    async logout() {
        await supabase.auth.signOut()
    }

    async getUser() {
        const { data } = await supabase.auth.getUser();
        return data.user;
    }

    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }
}