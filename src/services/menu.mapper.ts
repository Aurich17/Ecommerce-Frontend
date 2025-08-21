// menu.mapper.ts
import { MenuItem } from 'primeng/api';
import { ApiMenuItem } from '../app/auth/login/domain/response/login.response';
// import { ApiMenuItem } from './auth.models';

const iconMap: Record<string, string> = {
  like: 'pi pi-heart',
  home: 'pi pi-home',
  // agrega más mapeos si tu API usa otros íconos
};

const routeMap: Record<string, string> = {
  // MAIN GROUPS
  'Mantenimiento': '',
  // CHILDREN (según tus rutas actuales)
  'Productos': '/principal/mant/productos',
  'Solicitudes': '/principal/mant/solicitudes',

  // Si más adelante tu API trae "Landing" y otros:
  'Encabezado': '/principal/landing/encabezado',
  'Cuerpo': '/principal/landing/cuerpo',
  'Pie de página': '/principal/landing/piepagina',
  '¿Quiénes pueden usar?': '/principal/landing/quienes',
  '¿Cómo funciona?': '/principal/landing/funcionamiento',
  'Comentarios': '/principal/landing/comentarios',
};

export function mapApiMenuToPrime(apiMenu: ApiMenuItem[]): MenuItem[] {
  const toMenuItem = (node: ApiMenuItem): MenuItem => {
    const icon = iconMap[node.icon || ''] || 'pi pi-circle';
    const route = routeMap[node.label]; // puede ser undefined si es grupo

    const item: MenuItem = {
      label: node.label,
      icon,
      // usa 'items' solo si hay hijos
      ...(node.children?.length
        ? { items: node.children.map(toMenuItem) }
        : {}),
      // si no tiene hijos y existe route, úsala
      ...(route ? { routerLink: [route] } : {})
    };

    // Ejemplo: puedes deshabilitar por permisos (solo un ejemplo)
    if (node.perms && node.perms.edit === false && !node.children?.length) {
      item.disabled = true;
    }

    return item;
  };

  return apiMenu.map(toMenuItem);
}
