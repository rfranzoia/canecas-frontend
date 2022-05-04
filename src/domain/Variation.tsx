export enum BackgroundType { EMPTY = "EMPTY", PERSONALIZED = "PERSONALIZED" }

export interface Variation {
    _id?: string,
    product?: string,
    caricatures?: number,
    background?: string,
    price?: number,
    image?: string
}