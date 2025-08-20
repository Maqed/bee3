export const DEFAULT_LOGIN_REDIRECT = "/";

export const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

// Protected routes that require authentication
export const ADMIN_ROUTES = ["/admin"];

export const PROTECTED_ROUTES = [
  "/favorites",
  "/sell",
  "/user-settings",
  "/my-ads",
  ...ADMIN_ROUTES,
];
