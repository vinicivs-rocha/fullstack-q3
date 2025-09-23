"use client"
import { useAuth } from "@/hooks/use-auth";

export default function VistoriasPage() {
    const { meQuery } = useAuth();

    if (meQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (meQuery.isError) {
        return <div>Error: {meQuery.error.message}</div>;
    }

    return (
        <div>
            <h1>Vistorias</h1>
            <p>Welcome {meQuery.data?.email}</p>
        </div>
    )
}