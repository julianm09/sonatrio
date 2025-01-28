"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js"; // Import types from Supabase

interface AppContextType {
	user: User | null; // Supabase User type
	setUser: (user: User | null) => void;
	logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	console.log("is user", user);

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
		<AppContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error(
			"useAppContext must be used within an AppContextProvider"
		);
	}
	return context;
};
