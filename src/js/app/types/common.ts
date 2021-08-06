export interface GestureOptions {
    href: string|null;
}

export interface mouseEventResponse {
    action: null|string;
    canvas: {
        clear: boolean;
        draw: boolean;
        toX: number;
        toY: number;
        x: number;
        y: number;
    };
    gestureAction: string;
    gestureString: string;
    href: string;
    message: string;
}

export interface SendMessageParameter {
    event?: string;
    href?: string;
    keyCode?: string;
    msg: string;
    which?: number;
    x?: number;
    y?: number;
}

export interface LineParameter {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}
