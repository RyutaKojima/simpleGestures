export interface GestureOptions {
    href: string|null;
}

export interface mouseEventResponse {
    message: string;
    action: null|string;
    href: string;
    gestureString: string;
    gestureAction: string;
    canvas: {
        clear: boolean;
        draw: boolean;
        x: number;
        y: number;
        toX: number;
        toY: number;
    };
}

export interface SendMessageParameter {
    msg: string;
    event?: string;
    keyCode?: string;
    href?: string;
    x?: number;
    y?: number;
    which?: number;
}

export interface LineParameter {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}