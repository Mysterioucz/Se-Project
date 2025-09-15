"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";

export interface SessionState {
    isWarningModalOpen: boolean;
    timeLeft: number;
    isSessionExpired: boolean;
    isAuthenticated: boolean;
}

export interface SessionManagementConfig {
    inactivityTimeout?: number; // นาที
    warningDuration?: number; // วินาที
    onSessionExpired?: () => void;
    onWarningShow?: () => void;
}

export class SessionManager {
    private inactivityTimerRef: React.RefObject<NodeJS.Timeout | undefined>;
    private countdownTimerRef: React.RefObject<NodeJS.Timeout | undefined>;
    private lastActivityRef: React.RefObject<number>;
    private config: Required<SessionManagementConfig>;
    private setState: React.Dispatch<React.SetStateAction<SessionState>>;
    private session: Session;

    constructor(
        config: SessionManagementConfig,
        setState: React.Dispatch<React.SetStateAction<SessionState>>,
        session: Session
    ) {
        this.config = {
            inactivityTimeout: 30,
            warningDuration: 60,
            onSessionExpired: () => {},
            onWarningShow: () => {},
            ...config,
        };
        this.setState = setState;
        this.session = session;
        this.inactivityTimerRef = { current: undefined };
        this.countdownTimerRef = { current: undefined };
        this.lastActivityRef = { current: Date.now() };
    }

    public resetInactivityTimer = () => {
        this.lastActivityRef.current = Date.now();

        if (this.inactivityTimerRef.current) {
            clearTimeout(this.inactivityTimerRef.current);
        }

        this.setState((prev) => {
            if (prev.isWarningModalOpen) {
                if (this.countdownTimerRef.current) {
                    clearInterval(this.countdownTimerRef.current);
                }
                return {
                    ...prev,
                    isWarningModalOpen: false,
                    timeLeft: this.config.warningDuration,
                    isSessionExpired: false,
                };
            }
            return prev;
        });

        this.inactivityTimerRef.current = setTimeout(() => {
            if (this.session?.user) {
                this.showWarningModal();
            }
        }, this.config.inactivityTimeout * 60 * 1000);
    };

    private showWarningModal = () => {
        this.setState((prev) => ({
            ...prev,
            isWarningModalOpen: true,
            timeLeft: this.config.warningDuration,
            isSessionExpired: false,
        }));

        this.config.onWarningShow();

        let countdown = this.config.warningDuration;
        this.countdownTimerRef.current = setInterval(() => {
            countdown -= 1;
            this.setState((prev) => ({
                ...prev,
                timeLeft: countdown,
            }));

            if (countdown <= 0) {
                clearInterval(this.countdownTimerRef.current!);
                this.setState((prev) => ({
                    ...prev,
                    isSessionExpired: true,
                    timeLeft: 0,
                }));
                this.config.onSessionExpired();
            }
        }, 1000);
    };

    public extendSession = () => {
        this.resetInactivityTimer();
    };

    public handleSignOut = async () => {
        this.cleanup();
        await signOut({ callbackUrl: "/login" });
    };

    public closeWarningModal = () => {
        this.setState((prev) => ({
            ...prev,
            isWarningModalOpen: false,
            timeLeft: this.config.warningDuration,
            isSessionExpired: false,
        }));
        if (this.countdownTimerRef.current) {
            clearInterval(this.countdownTimerRef.current);
        }
    };

    public cleanup = () => {
        if (this.inactivityTimerRef.current) {
            clearTimeout(this.inactivityTimerRef.current);
        }
        if (this.countdownTimerRef.current) {
            clearInterval(this.countdownTimerRef.current);
        }
    };
}

export function useSessionManagement(config: SessionManagementConfig = {}) {
    const { data: session, status } = useSession();
    const [state, setState] = useState<SessionState>({
        isWarningModalOpen: false,
        timeLeft: config.warningDuration || 60,
        isSessionExpired: false,
        isAuthenticated: false,
    });

    const sessionManagerRef = useRef<SessionManager | null>(null);

    // อัพเดต authentication status
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            isAuthenticated: status === "authenticated",
        }));
    }, [status]);

    // Initialize session manager
    useEffect(() => {
        if (status !== "authenticated" || !session?.user) {
            return;
        }

        // Create session manager
        sessionManagerRef.current = new SessionManager(
            config,
            setState,
            session
        );

        // Event listeners for user activity
        const events = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click",
        ];

        const activityHandler = () => {
            sessionManagerRef.current?.resetInactivityTimer();
        };

        // Add event listeners
        events.forEach((event) => {
            document.addEventListener(event, activityHandler, true);
        });

        // Initialize timer
        sessionManagerRef.current.resetInactivityTimer();

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, activityHandler, true);
            });
            sessionManagerRef.current?.cleanup();
        };
    }, [session, status, config]);

    return {
        ...state,
        extendSession: () => sessionManagerRef.current?.extendSession(),
        handleSignOut: () => sessionManagerRef.current?.handleSignOut(),
        closeWarningModal: () => sessionManagerRef.current?.closeWarningModal(),
    };
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
