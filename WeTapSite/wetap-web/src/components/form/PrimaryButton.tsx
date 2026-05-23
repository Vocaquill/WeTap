import type { ReactNode } from "react";
import { Button } from "./Button";

interface PrimaryButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit';
}

export const PrimaryButton = ({ children, type = 'button' }: PrimaryButtonProps) => (
    <Button type={type} variant="primary" size="md">
        {children}
    </Button>
);
