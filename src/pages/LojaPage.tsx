import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Star, Filter, Package, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LojaPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('name');

      if (error) throw error;

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-txt-2 mt-4">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Mobile-First Header */}
      <div className="safe-area-top p-3 md:p-4 lg:p-6">
        <div className="text-center space-y-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-txt mb-2">
              🛒 Loja VOLT
            </h1>
            <p className="text-sm md:text-base text-txt-2">
              Suplementos e equipamentos premium para seu treino
            </p>
          </div>

          {/* Mobile-First Search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-3 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-surface border-line text-txt h-12"
              />
            </div>

            {/* Cart indicator */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-txt-2">
                {filteredProducts.length} produtos
              </Badge>
              {cart.length > 0 && (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-accent" />
                  <Badge className="bg-accent text-accent-ink">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-txt mb-4">⭐ Produtos em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} featured />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1 bg-surface">
            <TabsTrigger value="all" className="text-xs px-3 py-2">
              Todos ({products.length})
            </TabsTrigger>
            {categories.map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              return (
                <TabsTrigger key={category} value={category} className="text-xs px-3 py-2">
                  {category} ({categoryProducts.length})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-txt-3 mx-auto mb-4" />
                <p className="text-txt-2">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </TabsContent>

          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category);
            return (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

// Mobile-optimized product card
const ProductCard = ({ product, onAddToCart, featured = false }) => (
  <Card className={`glass-card p-3 md:p-4 hover:bg-surface/80 transition-all group ${featured ? 'ring-1 ring-accent/30' : ''}`}>
    <div className="space-y-3">
      {/* Product image */}
      <div className="aspect-square bg-surface/50 rounded-lg overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400';
          }}
        />
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-txt text-sm md:text-base line-clamp-2 flex-1">
            {product.name}
          </h3>
          {featured && (
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs ml-2 flex-shrink-0">
              Destaque
            </Badge>
          )}
        </div>

        <p className="text-xs md:text-sm text-txt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-accent">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Stock info */}
        <div className="flex items-center justify-between text-xs text-txt-3">
          <span>Estoque: {product.stock_quantity}</span>
          {product.stock_quantity > 0 ? (
            <span className="text-green-400">✓ Disponível</span>
          ) : (
            <span className="text-red-400">✗ Esgotado</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-line/30">
        <Button 
          className="flex-1 bg-accent text-accent-ink hover:bg-accent/90 text-sm"
          onClick={() => onAddToCart(product)}
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          {product.stock_quantity > 0 ? 'Adicionar' : 'Esgotado'}
        </Button>
        <Button variant="outline" size="sm" className="p-2">
          <Heart className="w-3 h-3" />
        </Button>
      </div>
    </div>
  </Card>
);

export default LojaPage;