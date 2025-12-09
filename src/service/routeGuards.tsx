// routeGuards.ts
import { getUserRole, HasEnvBypass } from './authService';

const routePermissions: Record<string, string[]> = {
    '/': ['USER', 'ADMIN'],
    '/acervo': ['USER', 'ADMIN'],
    '/emprestimos': ['USER', 'ADMIN'],
    '/atrasos': ['USER', 'ADMIN'],
    '/relatorios': ['USER', 'ADMIN'],
    '/perfil': ['USER', 'ADMIN'],
    '/configuracao': ['USER', 'ADMIN'],
    '/acesso-negado': ['USER', 'ADMIN'],
    '/login': ['PUBLIC'],
    '/logout': ['USER', 'ADMIN'],
};

const normalizeRole = (role: string | null): string | null => {
    if (!role) return null;
    // Remove ROLE_ prefixo e converte para maiúsculas
    const normalized = role.replace(/^ROLE_/i, '').toUpperCase();
    console.log(`🔄 Role normalization: "${role}" -> "${normalized}"`);
    return normalized;
};

export const canAccessRoute = (path: string): boolean => {
    console.log(`\n🔐 === ROUTE GUARD CHECK START ===`);
    console.log(`📁 Requested path: "${path}"`);
    
    if (HasEnvBypass()) {
        console.log(`🔓 Bypass enabled - granting access to "${path}"`);
        console.log(`✅ === ACCESS GRANTED (BYPASS) ===\n`);
        return true;
    }

    const userRole = getUserRole();
    console.log(`👤 User role from storage: "${userRole}"`);

    if (!userRole) {
        console.log(`❌ No user role found - denying access to "${path}"`);
        console.log(`🚫 === ACCESS DENIED (NO ROLE) ===\n`);
        return false;
    }

    const normalizedRole = normalizeRole(userRole);
    console.log(`🎭 Normalized role: "${normalizedRole}"`);

    // Verifica se a rota existe nas permissões
    const allowedRoles = routePermissions[path];
    
    if (!allowedRoles) {
        console.log(`⚠️ Path "${path}" not found in route permissions`);
        console.log(`📋 Available paths:`, Object.keys(routePermissions));
        
        // Verifica se é uma sub-rota (ex: /acervo/123)
        const isSubRoute = path.includes('/') && path !== '/';
        if (isSubRoute) {
            // Pega a rota base (ex: /acervo/123 -> /acervo)
            const basePath = '/' + path.split('/')[1];
            console.log(`🔍 Checking base path: "${basePath}"`);
            const baseAllowedRoles = routePermissions[basePath];
            
            if (baseAllowedRoles) {
                const hasAccess = baseAllowedRoles.includes(normalizedRole!);
                console.log(hasAccess ? `✅ Access to sub-route GRANTED` : `❌ Access to sub-route DENIED`);
                console.log(`${hasAccess ? '✅' : '🚫'} === ACCESS ${hasAccess ? 'GRANTED' : 'DENIED'} ===\n`);
                return hasAccess;
            }
        }
        
        console.log(`🚫 === ACCESS DENIED (PATH NOT FOUND) ===\n`);
        return false;
    }

    console.log(`📋 Allowed roles for "${path}":`, allowedRoles);
    
    const hasAccess = allowedRoles.includes(normalizedRole!);
    
    console.log(hasAccess ? `✅ Access GRANTED to "${path}"` : `❌ Access DENIED to "${path}"`);
    console.log(`Reason: User role "${normalizedRole}" ${hasAccess ? 'is' : 'is NOT'} in [${allowedRoles.join(', ')}]`);
    console.log(`${hasAccess ? '✅' : '🚫'} === ACCESS ${hasAccess ? 'GRANTED' : 'DENIED'} ===\n`);
    
    return hasAccess;
};

export const getAccessibleRoutes = (): string[] => {
    console.log(`\n🔐 === GETTING ACCESSIBLE ROUTES ===`);
    
    if (HasEnvBypass()) {
        const allRoutes = Object.keys(routePermissions).filter(route => !routePermissions[route].includes('PUBLIC'));
        console.log(`🔓 Bypass enabled - returning all non-public routes:`, allRoutes);
        console.log(`📋 === ACCESSIBLE ROUTES (BYPASS) ===\n`);
        return allRoutes;
    }

    const userRole = getUserRole();
    console.log(`👤 User role: "${userRole}"`);

    if (!userRole) {
        console.log(`❌ No user role - returning empty array`);
        console.log(`📋 === ACCESSIBLE ROUTES (EMPTY) ===\n`);
        return [];
    }

    const normalizedRole = normalizeRole(userRole);
    console.log(`🎭 Normalized role: "${normalizedRole}"`);

    const accessibleRoutes = Object.entries(routePermissions)
        .filter(([path, roles]) => {
            // Filtra rotas públicas
            if (roles.includes('PUBLIC')) {
                console.log(`➖ Skipping public route: "${path}"`);
                return false;
            }
            
            const isAccessible = roles.includes(normalizedRole!);
            console.log(`${isAccessible ? '➕' : '➖'} Route "${path}": ${isAccessible ? 'ACCESSIBLE' : 'NOT ACCESSIBLE'} [${roles.join(', ')}]`);
            return isAccessible;
        })
        .map(([path]) => path);

    console.log(`📋 Final accessible routes:`, accessibleRoutes);
    console.log(`📋 === ACCESSIBLE ROUTES FOUND ===\n`);
    
    return accessibleRoutes;
};

// Função para debug
export const debugRouteAccess = () => {
    console.log(`\n🔍 === ROUTE ACCESS DEBUG ===`);
    console.log(`Current user role: "${getUserRole()}"`);
    console.log(`Normalized: "${normalizeRole(getUserRole())}"`);
    console.log(`Bypass enabled: ${HasEnvBypass()}`);
    
    const allRoutes = Object.keys(routePermissions);
    console.log(`\n📋 Checking access for all routes:`);
    
    allRoutes.forEach(route => {
        const hasAccess = canAccessRoute(route);
        console.log(`${hasAccess ? '✅' : '❌'} ${route}: ${hasAccess ? 'Access' : 'No access'}`);
    });
    
    console.log(`\n📋 Accessible routes for current user:`, getAccessibleRoutes());
    console.log(`🔍 === DEBUG COMPLETE ===\n`);
};