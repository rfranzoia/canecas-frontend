export enum BackgroundType { EMPTY = "empty", PERSONALIZED = "personalized" }

export interface Variation {
    _id?: string,
    product?: string,
    caricature?: number,
    background?: string,
    price?: number,
    image?: string
}