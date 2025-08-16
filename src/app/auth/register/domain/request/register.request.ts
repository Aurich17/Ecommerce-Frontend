export interface RegisterClienteRequest {
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  fecha_nac: string;          // 'YYYY-MM-DD'

  // Códigos de Tipos (char(3))
  pais_cod: string;           // PAI
  provincia_cod: string;      // REG (o PRO, según tu tab)
  ciudad_cod: string;         // MUN
  ocupacion_cod: string;      // OCU
  genero_cod: string;         // GEN

  // Documentos (urls o keys)
  selfie_url: string;
  dni_reverso_url: string;

  // Credenciales
  email: string;
  password: string;

  // Contacto alternativo
  alt_nombre?: string;
  alt_telefono?: string;
}
