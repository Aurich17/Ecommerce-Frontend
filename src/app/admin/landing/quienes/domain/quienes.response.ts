export interface getLandingAudienceResponse {
    data: {
        items: itemsLandingAudience[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsLandingAudience {
    id: number,
    icon: string,
    entity: string,
    description: string,
    position: number,
    enabled: boolean,
    created_at: Date,
    updated_at: Date
}