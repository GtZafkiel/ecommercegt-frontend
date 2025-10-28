export type JwtPayload = { sub: string; email?: string; role?: string; exp?: number };

const TOKEN_KEY = "token";

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function parseJwt(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const json = atob(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getUserRole(): string | null {
    return parseJwt(getToken())?.role ?? null;
}

export function isAuthenticated(): boolean {
    const payload = parseJwt(getToken());
    if (!payload) return false;
    if (payload.exp && Date.now() / 1000 > payload.exp) {
        clearToken();
        return false;
    }
    return true;
}
