"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserContextType {
	user: User | null;
	userId: string | null;
	setUser: (user: User | null) => void;
	logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			const authUser = session?.user;
			if (authUser) {
				setUser(authUser);
			}

			if (authUser) {
				const { data, error } = await supabase
					.from("users")
					.select("id")
					.eq("auth_user_id", authUser.id)
					.single();

				if (error) {
					console.error("Error fetching app user ID:", error.message);
				} else {
					setUserId(data.id);
				}
			}
		};

		if (!user) {
			fetchUser();
		}
	}, [user]);

	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setUserId(null);
	};

	return (
		<UserContext.Provider value={{ user, userId, setUser, logout }}>
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
