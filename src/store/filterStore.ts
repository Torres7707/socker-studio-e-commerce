import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

// 1. 定义排序枚举（这是最容易出 Bug 的地方，交给 Zod）
export const SortBySchema = z.enum([
	'default',
	'price-asc',
	'price-desc',
	'rating',
	'newest',
]);

// 2. 定义完整的状态 Schema
export const FilterStateSchema = z.object({
	// 数组元组校验：必须是两个数字
	priceRange: z.tuple([z.number(), z.number()]),
	// 数值范围校验：0-5 分
	minRating: z.number().min(0).max(5).default(0),
	sortBy: SortBySchema,
	selectedCategories: z.array(z.string()).default([]),
	searchHistory: z.array(z.string()).default([]),
	popularSearches: z.array(z.string()).default([]),
});

// 3. 自动推导类型 (替代原有的 export interface FilterState)
export type FilterState = z.infer<typeof FilterStateSchema>;

interface FilterActions {
	setPriceRange: (range: [number, number]) => void;
	setMinRating: (rating: number) => void;
	setSortBy: (sort: FilterState['sortBy']) => void;
	setSelectedCategories: (categories: string[]) => void;
	toggleCategory: (category: string) => void;
	clearFilters: () => void;
	addSearchHistory: (query: string) => void;
	clearSearchHistory: () => void;
	getSearchSuggestions: (query: string) => string[];
}

const initialState: FilterState = {
	priceRange: [0, 500],
	minRating: 0,
	sortBy: 'default',
	selectedCategories: [],
	searchHistory: [],
	popularSearches: ['Nordic', 'Minimalist', 'Wood', 'Ceramic', 'Wool', 'Linen'],
};

export const useFilterStore = create<FilterState & FilterActions>()(
	persist(
		(set, get) => ({
			...initialState,

			setPriceRange: (range) => set({ priceRange: range }),

			setMinRating: (rating) => set({ minRating: rating }),

			setSortBy: (sort) => set({ sortBy: sort }),

			setSelectedCategories: (categories) =>
				set({ selectedCategories: categories }),

			toggleCategory: (category) => {
				const { selectedCategories } = get();
				if (selectedCategories.includes(category)) {
					set({
						selectedCategories: selectedCategories.filter(
							(c) => c !== category
						),
					});
				} else {
					set({
						selectedCategories: [...selectedCategories, category],
					});
				}
			},

			clearFilters: () =>
				set({
					priceRange: [0, 500],
					minRating: 0,
					sortBy: 'default',
					selectedCategories: [],
				}),

			addSearchHistory: (query) => {
				if (!query.trim()) return;
				const { searchHistory } = get();
				const filtered = searchHistory.filter((q) => q !== query);
				set({
					searchHistory: [query, ...filtered].slice(0, 10),
				});
			},

			clearSearchHistory: () => set({ searchHistory: [] }),

			getSearchSuggestions: (query) => {
				const { searchHistory, popularSearches } = get();
				if (!query.trim()) return popularSearches.slice(0, 5);

				const historyMatches = searchHistory.filter((q) =>
					q.toLowerCase().includes(query.toLowerCase())
				);
				const popularMatches = popularSearches.filter((q) =>
					q.toLowerCase().includes(query.toLowerCase())
				);

				return [...new Set([...historyMatches, ...popularMatches])].slice(0, 5);
			},
		}),
		{
			name: 'scandinavian_shop_filters',
		}
	)
);
