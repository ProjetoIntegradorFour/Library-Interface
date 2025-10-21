import { getUserRole, HasEnvBypass, } from './authService';

const routePermissions: Record<string, string[]> = {
    '/':                ['USER', 'ADMIN'],
    '/acervo':          ['USER', 'ADMIN'],
    '/emprestimos':     ['USER', 'ADMIN'],
    '/atrasos':         ['ADMIN'],
    '/relatorios':      ['ADMIN'],
    '/perfil':          ['USER', 'ADMIN'],
    '/configuracao':    ['ADMIN'],
};

export const canAccessRoute = (path: string): boolean => {
    if (HasEnvBypass()) return true;
    const userRole = getUserRole();
    if (!userRole) return false;
    const allowedRoles = routePermissions[path];
    return allowedRoles ? allowedRoles.includes(userRole) : false;
};

export const getAccessibleRoutes = (): string[] => {
    if (HasEnvBypass()) return Object.keys(routePermissions);
    const userRole = getUserRole();
    if (!userRole) return [];
    return Object.entries(routePermissions)
        .filter(([_, roles]) => roles.includes(userRole))
        .map(([path]) => path);
};