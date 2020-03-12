import { BehaviorSubject } from "rxjs"

export const token$ = new BehaviorSubject(localStorage.getItem("token"))

// här i denna funktionen så vill vi spara token och vi hämtar token från GetToken.js
export function updateToken(newToken) {
    if (!newToken) {
        localStorage.removeItem("token");
    } else {
        localStorage.setItem("token", newToken);
    }
    token$.next(newToken);
}