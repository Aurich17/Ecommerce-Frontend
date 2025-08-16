export interface getLandingTestimonialsResponse {
    data: {
        items: itemsLandingTestimonials[];
        total: number;
        page: number;
        limit: number;
    },
    success: boolean;
}

export interface itemsLandingTestimonials {
    id: number,
    comment: string,
    user_id: number,
    client_name: string,
    occupation_text: string,
    occupation_tab: string,
    occupation_cod: string,
    enabled: boolean,
    created_at: Date,
    updated_at: Date
}