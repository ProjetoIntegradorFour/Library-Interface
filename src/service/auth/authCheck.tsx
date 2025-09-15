export function AmILogged() {
    // compare .env string to 'bypass' the auth system
    return localStorage.getItem("app_token") !== null || import.meta.env.VITE_BYPASS_AUTH === "true";
}