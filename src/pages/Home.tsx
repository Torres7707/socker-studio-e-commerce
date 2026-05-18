import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useFilterStore, type FilterState } from '@/store/filterStore';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api';
import { type Product } from '@/schemas';
import {
	Cat,
	ShoppingCart,
	Heart,
	Search,
	User,
	LogOut,
	Star,
	Plus,
	Minus,
	Filter,
	X,
} from 'lucide-react';

// Categories
const categories = [
	'All',
	'Home Textiles',
	'Furniture',
	'Lighting',
	'Decor',
	'Storage',
];

const SORT_OPTIONS = [
	{ value: 'default', label: 'Default' },
	{ value: 'price-asc', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'rating', label: 'Highest Rated' },
	{ value: 'newest', label: 'Newest' },
] as const satisfies readonly { value: FilterState['sortBy']; label: string }[];

function Home() {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();
	const {
		items: cart,
		addItem,
		removeItem,
		getItemCount,
		getTotal,
	} = useCartStore();
	const {
		favorites,
		toggleFavorite,
		getCount: getFavoritesCount,
		fetchFavorites,
	} = useFavoritesStore();
	const {
		priceRange,
		minRating,
		sortBy,
		selectedCategories,
		searchHistory,
		setPriceRange,
		setMinRating,
		setSortBy,
		toggleCategory,
		clearFilters,
		addSearchHistory,
		clearSearchHistory,
		getSearchSuggestions,
	} = useFilterStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const searchRef = useRef<HTMLInputElement>(null);

	// Fetch favorites once on mount
	useEffect(() => {
		fetchFavorites();
	}, []);

	// Fetch products from API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setIsLoading(true);
				const result = await productsApi.getProducts({
					category:
						selectedCategories.length > 0 && !selectedCategories.includes('All')
							? selectedCategories[0]
							: undefined,
					search: searchQuery || undefined,
					minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
					maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
					minRating: minRating > 0 ? minRating : undefined,
					sortBy: sortBy !== 'default' ? sortBy : undefined,
				});
				setProducts(result.products || []);
			} catch (error) {
				console.error('Failed to fetch products:', error);
				toast.error('Failed to load products');
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, [selectedCategories, searchQuery, priceRange, minRating, sortBy]);

	const filteredProducts = products
		.filter((product) => {
			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.includes('All') ||
				selectedCategories.includes(product.category);
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesPrice =
				product.price >= priceRange[0] && product.price <= priceRange[1];
			const matchesRating = product.rating >= minRating;
			return matchesCategory && matchesSearch && matchesPrice && matchesRating;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'price-asc':
					return a.price - b.price;
				case 'price-desc':
					return b.price - a.price;
				case 'rating':
					return b.rating - a.rating;
				case 'newest':
					return b.id.localeCompare(a.id);
				default:
					return 0;
			}
		});

	const searchSuggestions = getSearchSuggestions(searchQuery);

	const removeFromCart = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const item = cart.find((item) => item.product.id === productId);
		if (item && item.quantity > 1) {
			useCartStore.getState().updateQuantity(productId, item.quantity - 1);
			toast.info(`Removed one ${item.product.name} from cart`);
		} else if (item) {
			removeItem(productId);
			toast.info(`Removed ${item.product.name} from cart`);
		}
	};

	const handleAddToCart = (product: Product, e: React.MouseEvent) => {
		e.stopPropagation();
		addItem(product);
		toast.success(`Added ${product.name} to cart`);
	};

	const handleToggleFavorite = async (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const wasFavorite = favorites.includes(productId);
		await toggleFavorite(productId);
		const product = products.find((p) => p.id === productId);
		if (product) {
			if (wasFavorite) {
				toast.info(`Removed ${product.name} from favorites`);
			} else {
				toast.success(`Added ${product.name} to favorites`);
			}
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query.trim()) {
			addSearchHistory(query);
		}
		setShowSearchSuggestions(false);
	};

	const handleClearFilters = () => {
		clearFilters();
		setSearchQuery('');
		toast.info('Filters cleared');
	};

	const cartTotal = getTotal();
	const cartCount = getItemCount();
	const favoritesCount = getFavoritesCount();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-snow">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center">
								<Cat className="w-4 h-4 text-white" />
							</div>
							<span className="text-lg font-semibold text-charcoal">
								Socker Studio
							</span>
						</div>

						{/* Search */}
						<div className="flex-1 max-w-md mx-8">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
								<Input
									type="search"
									placeholder="Search products..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-4">
							{/* Cart */}
							<button
								onClick={() => navigate('/cart')}
								className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
							>
								<ShoppingCart className="w-5 h-5" />
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-nordic-blue text-white text-xs rounded-full flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</button>

							{/* Favorites */}
							<button
								onClick={() => navigate('/favorites')}
								className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
							>
								<Heart className="w-5 h-5" />
								{favoritesCount > 0 && (
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-ash text-white text-xs rounded-full flex items-center justify-center">
										{favoritesCount}
									</span>
								)}
							</button>

							{/* About Socker */}
							<button
								onClick={() => navigate('/about')}
								className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
							>
								<Cat className="w-5 h-5" />
							</button>

							{/* User menu */}
							<div className="flex items-center gap-3 pl-4 border-l border-stone-200">
								<button
									onClick={() => navigate('/profile')}
									className="flex items-center gap-3 hover:opacity-80 transition-opacity"
								>
									<div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
										{user?.photoURL ? (
											<img
												src={user.photoURL}
												alt={user.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="w-4 h-4 text-sage" />
										)}
									</div>
									<div className="hidden sm:block text-left">
										<p className="text-sm font-medium text-charcoal">
											{user?.name}
										</p>
										<p className="text-xs text-slate">{user?.email}</p>
									</div>
								</button>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleLogout}
									className="text-slate hover:text-charcoal"
								>
									<LogOut className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Welcome section */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-charcoal">
						Welcome back, {user?.name}
					</h1>
					<p className="text-slate mt-1">
						Discover beautiful Scandinavian design for your home
					</p>
				</div>

				{/* Search and Filter Bar */}
				<div className="flex flex-col gap-4 mb-8">
					<div className="flex gap-4">
						<div className="flex-1 relative" ref={searchRef}>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
							<Input
								type="search"
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onFocus={() => setShowSearchSuggestions(true)}
								onBlur={() =>
									setTimeout(() => setShowSearchSuggestions(false), 200)
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSearch(searchQuery);
									}
								}}
								className="pl-10"
							/>
							{/* Search Suggestions */}
							{showSearchSuggestions && searchSuggestions.length > 0 && (
								<div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-stone-100 shadow-lg z-10 overflow-hidden">
									{searchHistory.length > 0 && (
										<div className="px-4 py-2 border-b border-stone-100">
											<div className="flex items-center justify-between">
												<span className="text-xs text-slate">
													Recent Searches
												</span>
												<button
													onClick={(e) => {
														e.stopPropagation();
														clearSearchHistory();
													}}
													className="text-xs text-nordic-blue hover:underline"
												>
													Clear
												</button>
											</div>
										</div>
									)}
									{searchSuggestions.map((suggestion, index) => (
										<button
											key={index}
											onClick={() => handleSearch(suggestion)}
											className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-frost transition-colors flex items-center gap-2"
										>
											<Search className="w-3 h-3 text-slate" />
											{suggestion}
										</button>
									))}
								</div>
							)}
						</div>
						<Button
							variant="outline"
							onClick={() => setShowFilters(!showFilters)}
							className={showFilters ? 'bg-nordic-blue text-white' : ''}
						>
							<Filter className="w-4 h-4 mr-2" />
							Filters
						</Button>
					</div>

					{/* Filters Panel */}
					{showFilters && (
						<div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-6">
							{/* Categories */}
							<div>
								<h3 className="font-medium text-charcoal mb-3">Categories</h3>
								<div className="flex flex-wrap gap-2">
									{categories.map((category) => (
										<button
											key={category}
											onClick={() => toggleCategory(category)}
											className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
												selectedCategories.includes(category)
													? 'bg-nordic-blue text-white'
													: 'bg-frost text-charcoal hover:bg-mist'
											}`}
										>
											{category}
										</button>
									))}
								</div>
							</div>

							{/* Price Range */}
							<div>
								<h3 className="font-medium text-charcoal mb-3">Price Range</h3>
								<div className="flex items-center gap-4">
									<Input
										type="number"
										placeholder="Min"
										value={priceRange[0]}
										onChange={(e) =>
											setPriceRange([Number(e.target.value), priceRange[1]])
										}
										className="w-24"
									/>
									<span className="text-slate">to</span>
									<Input
										type="number"
										placeholder="Max"
										value={priceRange[1]}
										onChange={(e) =>
											setPriceRange([priceRange[0], Number(e.target.value)])
										}
										className="w-24"
									/>
								</div>
							</div>

							{/* Rating */}
							<div>
								<h3 className="font-medium text-charcoal mb-3">
									Minimum Rating
								</h3>
								<div className="flex gap-2">
									{[0, 3, 4, 4.5].map((rating) => (
										<button
											key={rating}
											onClick={() => setMinRating(rating)}
											className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
												minRating === rating
													? 'bg-nordic-blue text-white'
													: 'bg-frost text-charcoal hover:bg-mist'
											}`}
										>
											{rating === 0 ? 'All' : `${rating}+ stars`}
										</button>
									))}
								</div>
							</div>

							{/* Sort */}
							<div>
								<h3 className="font-medium text-charcoal mb-3">Sort By</h3>
								<div className="flex flex-wrap gap-2">
									{SORT_OPTIONS.map((option) => (
										<button
											key={option.value}
											onClick={() => setSortBy(option.value)}
											className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
												sortBy === option.value
													? 'bg-nordic-blue text-white'
													: 'bg-frost text-charcoal hover:bg-mist'
											}`}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							{/* Clear Filters */}
							<Button
								variant="outline"
								onClick={handleClearFilters}
								className="w-full"
							>
								Clear All Filters
							</Button>
						</div>
					)}
				</div>

				{/* Active Filters */}
				{(selectedCategories.length > 0 ||
					minRating > 0 ||
					sortBy !== 'default') && (
					<div className="flex flex-wrap gap-2 mb-6">
						{selectedCategories.map((category) => (
							<span
								key={category}
								className="px-3 py-1 bg-nordic-blue text-white text-sm rounded-full flex items-center gap-1"
							>
								{category}
								<button onClick={() => toggleCategory(category)}>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
						{minRating > 0 && (
							<span className="px-3 py-1 bg-cedar text-white text-sm rounded-full flex items-center gap-1">
								{minRating}+ stars
								<button onClick={() => setMinRating(0)}>
									<X className="w-3 h-3" />
								</button>
							</span>
						)}
					</div>
				)}

				{/* Loading state */}
				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-blue"></div>
						<span className="ml-2 text-slate">Loading products...</span>
					</div>
				)}

				{/* Products grid */}
				{!isLoading && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredProducts.map((product) => (
							<div
								key={product.id}
								onClick={() => navigate(`/product/${product.id}`)}
								className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:shadow-stone/5 transition-all duration-300 cursor-pointer"
							>
								{/* Image */}
								<div className="relative aspect-square overflow-hidden bg-frost">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									{/* Favorite button */}
									<button
										onClick={(e) => handleToggleFavorite(product.id, e)}
										className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all ${
											favorites.includes(product.id)
												? 'text-rose-ash'
												: 'text-slate hover:text-rose-ash'
										}`}
									>
										<Heart
											className="w-4 h-4"
											fill={
												favorites.includes(product.id) ? 'currentColor' : 'none'
											}
										/>
									</button>
									{/* Sale badge */}
									{product.originalPrice && (
										<span className="absolute top-3 left-3 px-2 py-1 bg-sage text-white text-xs font-medium rounded-md">
											Sale
										</span>
									)}
									{!product.inStock && (
										<div className="absolute inset-0 bg-white/80 flex items-center justify-center">
											<span className="text-charcoal font-medium">
												Out of Stock
											</span>
										</div>
									)}
								</div>

								{/* Content */}
								<div className="p-4">
									<p className="text-xs text-slate uppercase tracking-wider mb-1">
										{product.category}
									</p>
									<h3 className="font-medium text-charcoal mb-1">
										{product.name}
									</h3>
									<p className="text-sm text-slate line-clamp-2 mb-3">
										{product.description}
									</p>

									{/* Rating */}
									<div className="flex items-center gap-1 mb-3">
										<Star className="w-4 h-4 text-cedar fill-cedar" />
										<span className="text-sm font-medium text-charcoal">
											{product.rating}
										</span>
										<span className="text-sm text-slate">
											({product.reviews})
										</span>
									</div>

									{/* Price and add to cart */}
									<div className="flex items-center justify-between">
										<div>
											<span className="text-lg font-semibold text-charcoal">
												${product.price}
											</span>
											{product.originalPrice && (
												<span className="text-sm text-slate line-through ml-2">
													${product.originalPrice}
												</span>
											)}
										</div>

										{cart.find((item) => item.product.id === product.id) ? (
											<div className="flex items-center gap-2">
												<button
													onClick={(e) => removeFromCart(product.id, e)}
													className="w-8 h-8 rounded-lg bg-frost flex items-center justify-center text-charcoal hover:bg-mist transition-colors"
												>
													<Minus className="w-4 h-4" />
												</button>
												<span className="w-6 text-center font-medium">
													{
														cart.find((item) => item.product.id === product.id)
															?.quantity
													}
												</span>
												<button
													onClick={(e) => handleAddToCart(product, e)}
													disabled={!product.inStock}
													className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center text-white hover:bg-nordic-blue-light transition-colors disabled:opacity-50"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>
										) : (
											<Button
												size="sm"
												onClick={(e) => handleAddToCart(product, e)}
												disabled={!product.inStock}
											>
												<Plus className="w-4 h-4" />
											</Button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty state */}
				{filteredProducts.length === 0 && (
					<div className="text-center py-12">
						<p className="text-slate">
							No products found matching your criteria.
						</p>
					</div>
				)}
			</main>

			{/* Cart summary - floating */}
			{cart.length > 0 && (
				<div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl border border-stone-100 p-4 min-w-[280px]">
					<h3 className="font-medium text-charcoal mb-3">Your Cart</h3>
					<div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
						{cart.map((item) => (
							<div
								key={item.product.id}
								className="flex justify-between text-sm"
							>
								<span className="text-charcoal">{item.product.name}</span>
								<span className="text-slate">
									{item.quantity} x ${item.product.price}
								</span>
							</div>
						))}
					</div>
					<div className="border-t border-stone-100 pt-3 flex justify-between items-center">
						<span className="font-medium text-charcoal">Total</span>
						<span className="text-lg font-semibold text-nordic-blue">
							${cartTotal.toFixed(2)}
						</span>
					</div>
					<Button className="w-full mt-4" onClick={() => navigate('/checkout')}>
						Checkout
					</Button>
				</div>
			)}
		</div>
	);
}

export default Home;
