import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar';
import styles from './Home.module.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [products] = useState([
    {
      id: 1,
      name: "Premium Coffee Blend",
      price: 29.99,
      image: "https://via.placeholder.com/300",
      category: "Beverages",
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: "Organic Green Tea",
      price: 19.99,
      image: "https://via.placeholder.com/300",
      category: "Beverages",
      rating: 4.3,
      inStock: true
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Beverages', 'Food', 'Snacks', 'Combos'];
  const companies = ['Company A', 'Company B', 'Company C', 'Company D'];

  const handleFilterChange = (selectedCompanies) => {
    // Filter your products based on selected companies
    // Update your products state accordingly
    console.log('Selected companies:', selectedCompanies);
  };
  
    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className={styles.pageWrapper}>
            <Navbar 
                cartCount={cartItems.length}
                onMenuClick={handleSidebarToggle}
            />
            
            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                companies={companies}
                onFilterChange={handleFilterChange}
            />
            
            <main className={styles.mainContent}>
                {/* Rest of your existing Home component content */}
                <div className={styles.container}>
                    {/* Hero Section */}
                    <section className={styles.hero}>
                        <div className={styles.heroContent}>
                        <h1>Welcome to Our Store</h1>
                        <p>Discover amazing products at great prices</p>
                        <button className={styles.shopNowBtn}>Shop Now</button>
                        </div>
                    </section>

                    {/* Filters Section */}
                    <section className={styles.filters}>
                        <div className={styles.categories}>
                        {categories.map(category => (
                            <button
                            key={category}
                            className={`${styles.categoryBtn} ${
                                selectedCategory === category ? styles.active : ''
                            }`}
                            onClick={() => setSelectedCategory(category)}
                            >
                            {category}
                            </button>
                        ))}
                        </div>

                        <div className={styles.sort}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        </div>
                    </section>

                    {/* Products Grid */}
                    <section className={styles.productsGrid}>
                        {products.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.productImage}>
                            <img src={product.image} alt={product.name} />
                            {!product.inStock && (
                                <div className={styles.outOfStock}>Out of Stock</div>
                            )}
                            </div>
                            <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <span className={styles.productCategory}>{product.category}</span>
                            <div className={styles.productDetails}>
                                <span className={styles.productPrice}>${product.price}</span>
                                <div className={styles.productRating}>
                                ★ {product.rating}
                                </div>
                            </div>
                            <button 
                                className={styles.addToCartBtn}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            </div>
                        </div>
                        ))}
                    </section>

                    {/* Featured Categories */}
                    <section className={styles.featuredCategories}>
                        <h2>Featured Categories</h2>
                        <div className={styles.categoryGrid}>
                        {categories.slice(1).map(category => (
                            <div key={category} className={styles.categoryCard}>
                            <img 
                                src={`https://via.placeholder.com/200x150`} 
                                alt={category} 
                            />
                            <h3>{category}</h3>
                            </div>
                        ))}
                        </div>
                    </section>
                    </div>
            </main>
        </div>
    );
};

export default Home;