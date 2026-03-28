import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FavoritesState } from '@/schemas';
import { favoritesApi } from '@/lib/api';

interface FavoritesActions {
	addFavorite: (productId: string) => Promise<void>;
	removeFavorite: (productId: string) => Promise<void>;
	toggleFavorite: (productId: string) => Promise<void>;
	isFavorite: (productId: string) => boolean;
	getCount: () => number;
	fetchFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
	persist(
		(set, get) => ({
			favorites: [],

			fetchFavorites: async () => {
				try {
					const products = await favoritesApi.getFavorites();
					set({ favorites: products.map((p: { id: string }) => p.id) });
				} catch (error) {
					console.error('Failed to fetch favorites:', error);
				}
			},

			addFavorite: async (productId) => {
				try {
					await favoritesApi.addToFavorites(productId);
					set((state) => ({
						favorites: [...state.favorites, productId],
					}));
				} catch (error) {
					console.error('Failed to add favorite:', error);
					throw error;
				}
			},

			removeFavorite: async (productId) => {
				try {
					await favoritesApi.removeFromFavorites(productId);
					set((state) => ({
						favorites: state.favorites.filter((id) => id !== productId),
					}));
				} catch (error) {
					console.error('Failed to remove favorite:', error);
					throw error;
				}
			},

			toggleFavorite: async (productId) => {
				const { favorites, addFavorite, removeFavorite } = get();
				if (favorites.includes(productId)) {
					await removeFavorite(productId);
				} else {
					await addFavorite(productId);
				}
			},

			isFavorite: (productId) => {
				return get().favorites.includes(productId);
			},

			getCount: () => {
				return get().favorites.length;
			},
		}),
		{
			name: 'scandinavian_shop_favorites',
		}
	)
);
