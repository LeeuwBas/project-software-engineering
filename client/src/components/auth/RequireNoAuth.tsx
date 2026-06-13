import { useIsAuth, useIsLoading } from "@/lib/auth/AuthManager";
import { Redirect } from "expo-router";
import React, { ReactNode } from "react";

/**
 * This component will instantly redirect to the given page if it is rendered when the user is
 * logged in.
 * 
 * @param children any component you want to protect, making the entire page it's on inaccessable if the
 * user is logged in. 
 * @param href which page to route to when logged in.
 * @returns 
 */
export default function RequireNoAuth({ children, href = "/(protected)", loading = "children" }: {
    children: ReactNode; 
    href?: string; 
    loading?: ReactNode 
}) {
    const isAuth = useIsAuth();
    const isLoading = useIsLoading();
    if (isLoading) {
        if (loading == "children") {
            return <>{children}</>;
        }
        return loading;
    } 
    if (!isAuth) return <>{children}</>;
    return <Redirect href={href} />;
}