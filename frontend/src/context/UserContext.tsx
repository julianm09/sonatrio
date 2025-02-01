"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js"; // Import types from Supabase

interface UserContextType {
	user: User | null; // Supabase User type
	setUser: (user: User | null) => void;
	logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	// Check session on initialization
	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session) {
				setUser(session.user); // session.user is of type User
			}
		};

		if (!user) {
			fetchUser();
		}
	}, [user]);

	// Logout function
	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, setUser, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error(
			"useUserContext must be used within an UserContextProvider"
		);
	}
	return context;
};
