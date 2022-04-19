export enum BackgroundType { EMPTY = "empty", PERSONALIZED = "personalized" }

export interface Variation {
    product?: string,
    drawings?: number,
    background?: string,
    price?: number,
    image?: string
}