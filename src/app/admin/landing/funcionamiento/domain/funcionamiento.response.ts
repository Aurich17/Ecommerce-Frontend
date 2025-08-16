export interface getLandingHowItWorksResponse {
    data: {
        items: itemsLandingHowItWorks[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsLandingHowItWorks {
    id: number,
    icon: string,
    description: string,
    step_order: number,
    enabled: boolean,
    created_at: Date,
    updated_at: Date
}