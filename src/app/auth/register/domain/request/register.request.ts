export interface registerClienteRequest {
    nombres: string,
    apellidos: string,
    telefono: string,
    direccion: string,
    fecha_nac: Date,
    pais_id: number,
    provincia_id: number,
    ciudad_id: number,
    ocupacion_id: number,
    genero_id: number,
    selfie_url: string,
    dni_url: string,
    email: string,
    password: string,
    alt_nombre: string,
    alt_telefono: string
}