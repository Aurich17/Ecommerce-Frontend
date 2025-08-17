export interface getMantTiposResponse {
    success: boolean,
    data: ItemsTipos[]
}

export interface ItemsTipos {
    tab: string,
    cod: string,
    desc: string
}