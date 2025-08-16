export interface FooterResponse{
    success: boolean,
    data: ItemsFooter
}

export interface ItemsFooter{
    id: number,
    contact_email: string,
    contact_phone: string,
    footer_title: string,
    footer_desc: string,
    footer_left_desc: string,
    footer_copy: string,
    created_at: Date,
    updated_at: Date
}