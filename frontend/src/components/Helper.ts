export type ButtonStyle = "fill" | "stroke" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
    text: string;
    iconStart?: string;
    iconEnd?: string;
    onClick?: () => void;
    disabled?: boolean;
    styleType?: ButtonStyle;  // fill, stroke, text
    size?: ButtonSize;        // sm, md, lg
    href: string;
}

export interface NavbarProps {
    isSignIn: boolean;
    displayName?: string;
}