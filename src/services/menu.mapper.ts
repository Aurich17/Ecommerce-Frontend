import { MenuItem } from 'primeng/api';
import { ApiMenuItem } from '../app/auth/login/domain/response/login.response';

// Mapea iconos del API a PrimeIcons:
const iconMap: Record<string, string> = {
  like: 'pi pi-heart',
  dollar: 'pi pi-dollar',
};

// Mapea labels del API a rutas (exactos a tu router):
const routeMap: Record<string, string> = {
  // Grupos
  Mantenimiento: '',
  Accesos: '',
  Landing: '',
  Perfil: '',
  Marketplace: '/principal/marketplace',
  'Mis comentarios': '/principal/miscomentarios',

  // Hijos Mantenimiento
  Productos: '/principal/mant/productos',
  Solicitudes: '/principal/mant/solicitudes',
  Categorías: '/principal/mant/categorias',
  Monedas: '/principal/mant/monedas',
  Negocios: '/principal/mant/negocios',

  // Hijos Accesos
  Roles: '/principal/accesos/roles',
  Usuarios: '/principal/accesos/usuarios',
  Módulos: '/principal/accesos/modulos',

  // Hijos Landing (ojo con acentos y mayúsculas)
  Encabezado: '/principal/landing/encabezado',
  Cuerpo: '/principal/landing/cuerpo',
  'Pie de Página': '/principal/landing/piepagina',
  '¿Quiénes pueden usar?': '/principal/landing/quienes',
  '¿Cómo funciona?': '/principal/landing/funcionamiento',
  Comentarios: '/principal/landing/comentarios',
  Pedidos: '/principal/pedidos/solicitud-compra',
  Slider: '/principal/landing/slider',
};

export function mapApiMenuToPrime(apiMenu: ApiMenuItem[]): MenuItem[] {
  const toMenuItem = (node: ApiMenuItem): MenuItem => {
    const icon = iconMap[node.icon || ''] || 'pi pi-circle';
    const route = routeMap[node.label];

    const item: any = {
      label: node.label,
      icon,
    };

    if (node.children?.length) {
      item.items = node.children.map(toMenuItem);
    } else if (route) {
      console.log('route', route);
      // IMPORTANTE: tu template usa `item.route`
      item.route = route;
    }

    // ejemplo: puedes deshabilitar según perms
    if (node.perms && node.perms.edit === false && !node.children?.length) {
      item.disabled = true;
    }

    return item;
  };

  return apiMenu.map(toMenuItem);
}
