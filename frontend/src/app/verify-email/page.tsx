"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VerifyEmail: React.FC = () => {
    const searchParams = useSearchParams(); // Directly get search params
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            fetch("http://localhost:8000/api/users/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        setMessage("Email verified successfully!");
                    } else {
                        setMessage(
                            "Verification failed. Token may be invalid or expired."
                        );
                    }
                })
                .catch(() =>
                    setMessage("An error occurred during verification.")
                );
        } else {
            setMessage("No verification token provided.");
        }
    }, [searchParams]);

    return <div>{message}</div>;
};

export default function VerifyEmailPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <VerifyEmail />
        </React.Suspense>
    );
}
