export interface getMantUsuariosResponse {
    data: {
        items: itemsUsuarios[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsUsuarios {
    id: string,
    fullName: string,
    email: string,
    phone: string,
    socialSecurity: string,
    status: string,
    roles: itemsSubListas[],
    accountState: itemsSubListas[],
    createdAt: Date
}
export interface itemsSubListas {
    tab: string,
    cod: string,
    desc: string
}