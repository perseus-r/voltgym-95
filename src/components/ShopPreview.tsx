import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Zap, Crown, Gift } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'BRL' | 'XP';
  category: 'supplements' | 'equipment' | 'clothing' | 'digital';
  image: string;
  rating: number;
  levelRequired?: string;
  featured?: boolean;
}

const mockItems: ShopItem[] = [
  {
    id: '1',
    name: 'Whey Protein Premium',
    description: 'Proteína de alta qualidade para ganho de massa muscular',
    price: 89.90,
    currency: 'BRL',
    category: 'supplements',
    image: '🥛',
    rating: 4.8,
    featured: true
  },
  {
    id: '2',
    name: 'Creatina Monohidratada',
    description: 'Creatina pura para aumento de força e potência',
    price: 45.90,
    currency: 'BRL',
    category: 'supplements',
    image: '💊',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Halteres Ajustáveis 20kg',
    description: 'Par de halteres com sistema de ajuste rápido',
    price: 299.90,
    currency: 'BRL',
    category: 'equipment',
    image: '🏋️',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Camiseta BORA Training',
    description: 'Camiseta premium com tecnologia Dri-FIT',
    price: 49.90,
    currency: 'BRL',
    category: 'clothing',
    image: '👕',
    rating: 4.6
  },
  {
    id: '5',
    name: 'Shorts BORA Performance',
    description: 'Shorts de treino com tecido respirável',
    price: 39.90,
    currency: 'BRL',
    category: 'clothing',
    image: '🩳',
    rating: 4.5
  },
  {
    id: '6',
    name: 'Plano IA Coach Premium',
    description: 'IA personalizada com análise avançada e coaching 24/7',
    price: 500,
    currency: 'XP',
    category: 'digital',
    image: '🤖',
    rating: 4.9,
    levelRequired: 'Soldado',
    featured: true
  },
  {
    id: '7',
    name: 'Previews 3D Exercícios',
    description: 'Biblioteca completa com demonstrações 3D de todos os exercícios',
    price: 250,
    currency: 'XP',
    category: 'digital',
    image: '📱',
    rating: 4.7,
    levelRequired: 'Soldado'
  },
  {
    id: '8',
    name: 'Planos Personalizados IA',
    description: 'Treinos gerados por IA baseados em seus objetivos',
    price: 150,
    currency: 'XP',
    category: 'digital',
    image: '📋',
    rating: 4.8
  }
];

export function ShopPreview() {
  const [items, setItems] = useState<ShopItem[]>(mockItems);
  const [userXP] = useState(156); // Mock user XP
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
  const [isAdmin] = useState(true); // For demo - admin can add products
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'BRL' as 'BRL' | 'XP',
    category: 'supplements' as any,
    image: '📦'
  });

  const categoryIcons = {
    supplements: '💊',
    equipment: '🏋️',
    clothing: '👕',
    digital: '📱'
  };

  const formatPrice = (price: number, currency: 'BRL' | 'XP') => {
    if (currency === 'BRL') {
      return `R$ ${price.toFixed(2)}`;
    }
    return `${price} XP`;
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.description && newProduct.price > 0) {
      const product: ShopItem = {
        id: Date.now().toString(),
        ...newProduct,
        rating: 5.0,
        featured: false
      };
      setItems([...items, product]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        currency: 'BRL',
        category: 'supplements',
        image: '📦'
      });
      setShowAddProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-accent/20">
            <ShoppingBag className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">🛒 BORA Shop</h2>
            <p className="text-txt-2">Produtos premium para acelerar sua evolução</p>
          </div>
        </div>

        {/* XP Balance & Admin Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-txt-2">Seu XP:</span>
              <span className="font-bold text-accent">{userXP} XP</span>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Soldado
            </Badge>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="btn-premium"
              size="sm"
            >
              + Adicionar Produto
            </Button>
          )}
        </div>

        {/* Add Product Form */}
        {showAddProduct && isAdmin && (
          <div className="bg-surface/50 border border-line rounded-lg p-4 mb-4 space-y-4">
            <h4 className="font-semibold text-txt">Adicionar Novo Produto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-txt-2 block mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt"
                  placeholder="Ex: Whey Protein Premium"
                />
              </div>
              <div>
                <label className="text-sm text-txt-2 block mb-1">Preço</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="flex-1 p-2 bg-input-bg border border-input-border rounded-lg text-txt"
                    placeholder="0.00"
                  />
                  <select
                    value={newProduct.currency}
                    onChange={(e) => setNewProduct({...newProduct, currency: e.target.value as 'BRL' | 'XP'})}
                    className="p-2 bg-input-bg border border-input-border rounded-lg text-txt"
                  >
                    <option value="BRL">BRL</option>
                    <option value="XP">XP</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-txt-2 block mb-1">Descrição</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt h-20"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
              <div>
                <label className="text-sm text-txt-2 block mb-1">Categoria</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                  className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt"
                >
                  <option value="supplements">Suplementos</option>
                  <option value="equipment">Equipamentos</option>
                  <option value="clothing">Roupas</option>
                  <option value="digital">Digital</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-txt-2 block mb-1">Emoji/Ícone</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt"
                  placeholder="📦"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addProduct} className="btn-premium">
                Adicionar Produto
              </Button>
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Product Type Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setProductType('physical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              productType === 'physical' 
                ? 'bg-accent text-accent-ink' 
                : 'glass-button'
            }`}
          >
            🛍️ Produtos Físicos
          </button>
          <button
            onClick={() => setProductType('digital')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              productType === 'digital' 
                ? 'bg-accent text-accent-ink' 
                : 'glass-button'
            }`}
          >
            💻 Produtos Digitais
          </button>
        </div>
      </div>

      {/* Featured Items */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          Em Destaque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.filter(item => item.featured).map((item) => (
            <div key={item.id} className="glass-card p-6 relative">
              {item.featured && (
                <Badge className="absolute top-4 right-4 bg-warning text-warning-foreground">
                  Destaque
                </Badge>
              )}
              
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.image}</div>
                <h4 className="text-lg font-semibold text-txt">{item.name}</h4>
                <p className="text-sm text-txt-2 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm text-txt">{item.rating}</span>
                </div>
                
                <div className="text-xl font-bold text-accent">
                  {formatPrice(item.price, item.currency)}
                </div>
              </div>
              
              <Button 
                className="w-full btn-premium"
                disabled={item.currency === 'XP' && userXP < item.price}
              >
                {item.currency === 'XP' && userXP < item.price 
                  ? 'XP Insuficiente' 
                  : 'Comprar Agora'
                }
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid by Type */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4">
          {productType === 'physical' ? '🛍️ Produtos Físicos' : '💻 Produtos Digitais'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
            .filter(item => 
              productType === 'physical' 
                ? ['supplements', 'equipment', 'clothing'].includes(item.category)
                : item.category === 'digital'
            )
            .map((item) => (
              <div key={item.id} className="glass-card p-4 hover:bg-surface/80 transition-all border border-line/50">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{item.image}</div>
                  <h4 className="font-semibold text-txt mb-1">{item.name}</h4>
                  <p className="text-sm text-txt-2 mb-2">{item.description}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="text-sm text-txt">{item.rating}</span>
                  </div>
                  
                  {item.levelRequired && (
                    <Badge variant="outline" className="text-xs mb-2">
                      Requer: {item.levelRequired}
                    </Badge>
                  )}
                  
                  <div className="text-lg font-bold text-accent mb-3">
                    {formatPrice(item.price, item.currency)}
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-premium"
                  disabled={item.currency === 'XP' && userXP < item.price}
                >
                  {item.currency === 'XP' && userXP < item.price 
                    ? 'XP Insuficiente' 
                    : 'Comprar'
                  }
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4">📦 Categorias</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryIcons).map(([category, icon]) => {
            const categoryItems = items.filter(item => item.category === category);
            const categoryName = {
              supplements: 'Suplementos',
              equipment: 'Equipamentos',
              clothing: 'Roupas',
              digital: 'Digital'
            }[category];
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`glass-card p-4 text-center hover:bg-white/5 transition-all ${
                  selectedCategory === category ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-semibold text-txt">{categoryName}</div>
                <div className="text-sm text-txt-2">{categoryItems.length} items</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* XP Items */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Compre com XP
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.filter(item => item.currency === 'XP').map((item) => (
            <div key={item.id} className="glass-card p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{item.image}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-txt">{item.name}</h4>
                  <p className="text-sm text-txt-2">{item.description}</p>
                  {item.levelRequired && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Requer: {item.levelRequired}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-bold text-accent">
                    {formatPrice(item.price, item.currency)}
                  </div>
                  <Button 
                    size="sm" 
                    className="btn-premium mt-2"
                    disabled={userXP < item.price}
                  >
                    {userXP < item.price ? 'Sem XP' : 'Comprar'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earn XP CTA */}
      <div className="glass-card p-6 text-center">
        <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-txt mb-2">💰 Ganhe Mais XP</h3>
        <p className="text-txt-2 mb-4">
          Complete treinos, mantenha sua sequência e suba de nível para ganhar XP!
        </p>
        <div className="flex gap-2 justify-center text-sm text-txt-3">
          <span>• Treino completo: +30 XP</span>
          <span>• Streak 7 dias: +50 XP</span>
          <span>• Novo recorde: +25 XP</span>
        </div>
      </div>
    </div>
  );
}