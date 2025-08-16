export interface getLandingFAQResponse {
    data: {
        items: itemsLandingFAQ[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsLandingFAQ {
    id: number,
    pregunta: string,
    respuesta: string,
    orden: number,
    activo: boolean,
    created_at: Date,
    updated_at: Date
}

export interface getLandingFeaturesResponse {
    data: {
        items: itemsLandingFeatures[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsLandingFeatures {
    id: number,
    icono: string,
    titulo: string,
    descripcion: string,
    orden: number,
    activo: boolean,
    created_at: Date,
    updated_at: Date
}