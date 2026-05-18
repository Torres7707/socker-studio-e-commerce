import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/store/favoritesStore';
import { favoritesApi } from '@/lib/api';
import { type Product } from '@/schemas';
import Layout from '@/components/Layout';
import {
	Heart,
	Star,
	Plus,
	ChevronRight,
	Trash2,
} from 'lucide-react';

function Favorites() {
	const navigate = useNavigate();
	const { removeFavorite, fetchFavorites } = useFavoritesStore();
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch favorites from API on mount
	useEffect(() => {
		const loadFavorites = async () => {
			try {
				setIsLoading(true);
				await fetchFavorites();
				const products = await favoritesApi.getFavorites();
				setFavoriteProducts(products);
			} catch (error) {
				console.error('Failed to fetch favorites:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadFavorites();
	}, []);

	return (
		<Layout>
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-slate mb-8">
				<button
					onClick={() => navigate('/')}
					className="hover:text-nordic-blue transition-colors"
				>
					Home
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="text-charcoal">Favorites</span>
			</nav>

			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-semibold text-charcoal">My Favorites</h1>
				<button
					onClick={() => navigate('/')}
					className="flex items-center gap-2 text-nordic-blue hover:text-nordic-blue-light transition-colors"
				>
					Continue Shopping
				</button>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-blue"></div>
					<span className="ml-2 text-slate">Loading favorites...</span>
				</div>
			) : favoriteProducts.length === 0 ? (
				<div className="text-center py-16">
					<Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
					<h2 className="text-xl font-medium text-charcoal mb-2">
						No favorites yet
					</h2>
					<p className="text-slate mb-6">
						Start adding products to your favorites list.
					</p>
					<Button onClick={() => navigate('/')}>Start Shopping</Button>
				</div>
			) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{favoriteProducts.map((product) => (
							<div
								key={product.id}
								className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:shadow-stone/5 transition-all duration-300"
							>
								{/* Image */}
								<div
									className="relative aspect-square overflow-hidden bg-frost cursor-pointer"
									onClick={() => navigate(`/product/${product.id}`)}
								>
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								{/* Remove from favorites button */}
								<button
									onClick={async (e) => {
										e.stopPropagation();
										await removeFavorite(product.id);
										// Refresh favorites list
										const products = await favoritesApi.getFavorites();
										setFavoriteProducts(products);
									}}
									className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-rose-ash hover:bg-white transition-all"
								>
									<Trash2 className="w-4 h-4" />
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
									<h3
										className="font-medium text-charcoal mb-1 cursor-pointer hover:text-nordic-blue transition-colors"
										onClick={() => navigate(`/product/${product.id}`)}
									>
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

										<Button
											size="sm"
											onClick={() => navigate(`/product/${product.id}`)}
											disabled={!product.inStock}
										>
											<Plus className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
		</Layout>
	);
}

export default Favorites;
