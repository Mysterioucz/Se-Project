// For global Interface
export type ModalVariant = "normal" | "criticalwarning" | "warning";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    topic: string;
    icon?: string;
    subTopic?: string;
    description: string;
    leftButtonText: string;
    rightButtonText: string;
    onLeftButton?: () => void;
    onRightButton?: () => void;
    showRightBtn?: boolean;
    showLeftBtn?: boolean;
    variant: ModalVariant;
    preventClose?: boolean;
    disableRightButton?: boolean;
}

export const themeColors: Record<
    ModalVariant,
    {
        topic: string;
        subTopic: string;
        description: string;
        button: {
            left: { color: string; border: string };
            right: { bg: string; color: string; hoverBg: string };
        };
    }
> = {
    normal: {
        topic: "var(--color-primary-700)",
        subTopic: "var(--color-primary-500)",
        description: "var(--color-gray-300)",
        button: {
            left: {
                color: "var(--color-primary-400)",
                border: "var(--color-primary-400)",
            },
            right: {
                bg: "var(--color-primary-400)",
                color: "var(--color-common-white)",
                hoverBg: "var(--color-primary-700)",
            },
        },
    },
    criticalwarning: {
        topic: "var(--color-error-main)",
        subTopic: "var(--color-error-main)",
        description: "var(--color-gray-300)",
        button: {
            left: {
                color: "var(--color-error-main)",
                border: "var(--color-error-main)",
            },
            right: {
                bg: "var(--color-error-main)",
                color: "var(--color-common-white)",
                hoverBg: "var(--color-error-main)",
            },
        },
    },
    warning: {
        topic: "var(--color-warning-dark)",
        subTopic: "var(--color-warning-main)",
        description: "var(--color-gray-300)",
        button: {
            left: {
                color: "var(--color-warning-main)",
                border: "var(--color-warning-main)",
            },
            right: {
                bg: "var(--color-warning-main)",
                color: "var(--color-common-white)",
                hoverBg: "var(--color-warning-dark)",
            },
        },
    },
};
