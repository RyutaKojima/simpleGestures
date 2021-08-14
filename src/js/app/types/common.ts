export interface GestureOptions {
    href: string|null;
}

export interface SendMessageParameter {
    event?: string;
    href?: string;
    msg: string;
}

export interface LineParameter {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}
