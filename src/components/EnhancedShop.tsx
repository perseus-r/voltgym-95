import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Star, 
  Zap, 
  Crown, 
  Gift, 
  Eye, 
  ShoppingCart, 
  CreditCard,
  Package,
  Truck,
  Lock,
  Shield
} from "lucide-react";

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
  detailed_description?: string;
  specifications?: string[];
  images?: string[];
  in_stock?: boolean;
}

interface CartItem {
  item: ShopItem;
  quantity: number;
}

const mockItems: ShopItem[] = [
  {
    id: '1',
    name: 'Whey Protein Premium',
    description: 'Proteína de alta qualidade para ganho de massa muscular',
    detailed_description: 'Whey Protein Premium com 80% de proteína pura, sabor chocolate, 1kg. Ideal para pós-treino e crescimento muscular.',
    specifications: ['80% proteína', '1kg', 'Sabor chocolate', 'Sem lactose', 'Origem USA'],
    price: 89.90,
    currency: 'BRL',
    category: 'supplements',
    image: '🥛',
    rating: 4.8,
    featured: true,
    in_stock: true,
    images: ['🥛', '📦', '🏷️']
  },
  {
    id: '2',
    name: 'Creatina Monohidratada',
    description: 'Creatina pura para aumento de força e potência',
    detailed_description: 'Creatina monohidratada 100% pura, 300g. Comprovada cientificamente para aumento de força e potência muscular.',
    specifications: ['100% pura', '300g', 'Sem sabor', 'Solúvel', 'Testada em laboratório'],
    price: 45.90,
    currency: 'BRL',
    category: 'supplements',
    image: '💊',
    rating: 4.9,
    in_stock: true
  },
  {
    id: '6',
    name: 'Plano IA Coach Premium',
    description: 'IA personalizada com análise avançada e coaching 24/7',
    detailed_description: 'Acesso completo ao IA Coach com análise de movimento 3D, planos personalizados e acompanhamento em tempo real.',
    specifications: ['Análise 3D', 'Coaching 24/7', 'Planos personalizados', 'Analytics avançados', 'Suporte premium'],
    price: 500,
    currency: 'XP',
    category: 'digital',
    image: '🤖',
    rating: 4.9,
    levelRequired: 'Soldado',
    featured: true,
    in_stock: true
  }
];

export function EnhancedShop() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>(mockItems);
  const [userXP] = useState(156);
  const [userLevel] = useState('Soldado');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
  const [showNewUserBlock, setShowNewUserBlock] = useState(false);

  // Check if user is new (less than 7 days or low XP)
  useEffect(() => {
    if (user && userXP < 100) {
      setShowNewUserBlock(true);
    }
  }, [user, userXP]);

  const formatPrice = (price: number, currency: 'BRL' | 'XP') => {
    if (currency === 'BRL') {
      return `R$ ${price.toFixed(2)}`;
    }
    return `${price} XP`;
  };

  const addToCart = (item: ShopItem) => {
    if (item.currency === 'XP' && userXP < item.price) {
      toast.error('XP insuficiente para este item');
      return;
    }

    if (item.levelRequired && userLevel !== item.levelRequired && userLevel !== 'Capitão') {
      toast.error(`Requer nível ${item.levelRequired} ou superior`);
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(prev => prev.map(cartItem => 
        cartItem.item.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart(prev => [...prev, { item, quantity: 1 }]);
    }
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }
    setShowCheckout(true);
    setShowCart(false);
  };

  const completeCheckout = () => {
    // Simulated checkout process
    const totalBRL = cart.filter(item => item.item.currency === 'BRL').reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    const totalXP = cart.filter(item => item.item.currency === 'XP').reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    
    toast.success(`Compra realizada! Total: R$ ${totalBRL.toFixed(2)} + ${totalXP} XP`);
    setCart([]);
    setShowCheckout(false);
  };

  const physicalItems = items.filter(item => ['supplements', 'equipment', 'clothing'].includes(item.category));
  const digitalItems = items.filter(item => item.category === 'digital');

  if (showNewUserBlock && productType === 'physical') {
    return (
      <div className="space-y-6">
        <div className="liquid-glass p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-txt mb-4">🛒 Loja Temporariamente Bloqueada</h2>
          <p className="text-txt-2 mb-6">
            Para novos usuários, a loja física está temporariamente bloqueada até que tudo esteja perfeitamente alinhado.
          </p>
          <div className="space-y-4">
            <div className="liquid-glass p-4">
              <h3 className="font-semibold text-txt mb-2">📱 Produtos Digitais Disponíveis</h3>
              <p className="text-txt-2 text-sm">
                Você pode acessar e comprar produtos digitais com seu XP atual!
              </p>
            </div>
            <Button 
              onClick={() => setProductType('digital')}
              className="bg-accent hover:bg-accent/90 text-accent-ink"
            >
              Ver Produtos Digitais
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="liquid-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-txt">🛒 BORA Shop</h2>
              <p className="text-txt-2">Produtos premium para acelerar sua evolução</p>
            </div>
          </div>
          
          {/* Cart Button */}
          <Button 
            onClick={() => setShowCart(true)}
            className="liquid-glass-button relative"
            variant="outline"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Carrinho
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-ink min-w-5 h-5 text-xs">
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-txt-2">Seu XP:</span>
            <span className="font-bold text-accent">{userXP} XP</span>
          </div>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {userLevel}
          </Badge>
        </div>

        {/* Product Type Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setProductType('physical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              productType === 'physical' 
                ? 'bg-accent text-accent-ink' 
                : 'liquid-glass-button'
            }`}
          >
            🛍️ Produtos Físicos
          </button>
          <button
            onClick={() => setProductType('digital')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              productType === 'digital' 
                ? 'bg-accent text-accent-ink' 
                : 'liquid-glass-button'
            }`}
          >
            💻 Produtos Digitais
          </button>
        </div>
      </div>

      {/* Featured Items */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Em Destaque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.filter(item => item.featured).map((item) => (
            <div key={item.id} className="liquid-glass p-6 relative">
              {item.featured && (
                <Badge className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Destaque
                </Badge>
              )}
              
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.image}</div>
                <h4 className="text-lg font-semibold text-txt">{item.name}</h4>
                <p className="text-sm text-txt-2 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-txt">{item.rating}</span>
                </div>
                
                <div className="text-xl font-bold text-accent mb-3">
                  {formatPrice(item.price, item.currency)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedItem(item)}
                  variant="outline"
                  className="flex-1 liquid-glass-button"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Detalhes
                </Button>
                <Button 
                  onClick={() => addToCart(item)}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-ink"
                  disabled={item.currency === 'XP' && userXP < item.price}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <h3 className="text-lg font-semibold text-txt mb-4">
          {productType === 'physical' ? '🛍️ Produtos Físicos' : '💻 Produtos Digitais'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(productType === 'physical' ? physicalItems : digitalItems).map((item) => (
            <div key={item.id} className="liquid-glass p-4 hover:bg-surface/80 transition-all border border-line/50">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{item.image}</div>
                <h4 className="font-semibold text-txt mb-1">{item.name}</h4>
                <p className="text-sm text-txt-2 mb-2">{item.description}</p>
                
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-txt">{item.rating}</span>
                </div>
                
                {item.levelRequired && (
                  <Badge variant="outline" className="text-xs mb-2 border-accent/30 text-accent">
                    Requer: {item.levelRequired}
                  </Badge>
                )}
                
                <div className="text-lg font-bold text-accent mb-3">
                  {formatPrice(item.price, item.currency)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setSelectedItem(item)}
                  variant="outline"
                  className="w-full liquid-glass-button"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-ink"
                  disabled={item.currency === 'XP' && userXP < item.price}
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="liquid-glass max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-txt flex items-center gap-2">
              <span className="text-2xl">{selectedItem?.image}</span>
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription className="text-txt-2">
              Detalhes completos do produto selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {/* Product Images */}
              {selectedItem.images && (
                <div className="flex gap-2 justify-center">
                  {selectedItem.images.map((img, idx) => (
                    <div key={idx} className="text-2xl p-2 liquid-glass rounded-lg">
                      {img}
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold text-txt mb-2">📝 Descrição</h4>
                <p className="text-txt-2">{selectedItem.detailed_description || selectedItem.description}</p>
              </div>

              {/* Specifications */}
              {selectedItem.specifications && (
                <div>
                  <h4 className="font-semibold text-txt mb-2">📋 Especificações</h4>
                  <ul className="text-txt-2 space-y-1">
                    {selectedItem.specifications.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-txt">{selectedItem.rating}</span>
                <span className="text-txt-2">/ 5.0</span>
              </div>

              {/* Price */}
              <div className="text-center p-4 liquid-glass">
                <div className="text-2xl font-bold text-accent mb-2">
                  {formatPrice(selectedItem.price, selectedItem.currency)}
                </div>
                {selectedItem.in_stock ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Em Estoque
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    Fora de Estoque
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedItem(null)} className="liquid-glass-button">
              Fechar
            </Button>
            {selectedItem && (
              <Button 
                onClick={() => {
                  addToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="bg-accent hover:bg-accent/90 text-accent-ink"
                disabled={selectedItem.currency === 'XP' && userXP < selectedItem.price}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="liquid-glass max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-txt flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Carrinho de Compras
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center p-8 text-txt-2">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Carrinho vazio
              </div>
            ) : (
              cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex items-center gap-4 p-4 liquid-glass">
                  <div className="text-2xl">{cartItem.item.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-txt">{cartItem.item.name}</h4>
                    <p className="text-sm text-txt-2">{formatPrice(cartItem.item.price, cartItem.item.currency)}</p>
                  </div>
                  <div className="text-txt">x{cartItem.quantity}</div>
                  <Button 
                    onClick={() => removeFromCart(cartItem.item.id)}
                    variant="outline"
                    size="sm"
                    className="liquid-glass-button"
                  >
                    Remover
                  </Button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-line pt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-accent mb-4">
                  Total: R$ {getTotalPrice().toFixed(2)}
                </div>
                <Button 
                  onClick={proceedToCheckout}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-ink"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Finalizar Compra
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="liquid-glass max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-txt flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Finalizar Compra
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-txt mb-2">📦 Resumo do Pedido</h4>
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex justify-between text-sm text-txt-2">
                  <span>{cartItem.item.name} x{cartItem.quantity}</span>
                  <span>{formatPrice(cartItem.item.price * cartItem.quantity, cartItem.item.currency)}</span>
                </div>
              ))}
              <div className="border-t border-line mt-2 pt-2 font-semibold text-txt">
                Total: R$ {getTotalPrice().toFixed(2)}
              </div>
            </div>

            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-txt mb-2">🚚 Entrega</h4>
              <p className="text-sm text-txt-2">
                Produtos físicos: 5-7 dias úteis<br />
                Produtos digitais: Acesso imediato
              </p>
            </div>

            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-txt mb-2">💳 Pagamento</h4>
              <p className="text-sm text-txt-2">
                Será direcionado para o gateway de pagamento seguro
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCheckout(false)} className="liquid-glass-button">
              Voltar
            </Button>
            <Button 
              onClick={completeCheckout}
              className="bg-accent hover:bg-accent/90 text-accent-ink"
            >
              <Shield className="w-4 h-4 mr-2" />
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}