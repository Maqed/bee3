export const DEFAULT_LOGIN_REDIRECT = "/";

export const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

// Protected routes that require authentication
export const PROTECTED_ROUTES = ["/favorites", "/sell", "/user-settings"];

// Authentication routes that signed-in users shouldn't access
export const ONLY_UNAUTHENTICATED_ROUTES = ["/login", "/register"];
