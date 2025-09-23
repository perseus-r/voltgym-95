import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  ShoppingCart, 
  Tag,
  Star,
  Eye,
  Save,
  X
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock_quantity: string;
  image_url: string;
  is_active: boolean;
  featured: boolean;
}

const categories = [
  'Suplementos',
  'Roupas',
  'Acessórios',
  'Equipamentos',
  'Nutrição',
  'Outros'
];

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'Suplementos',
    stock_quantity: '',
    image_url: '',
    is_active: true,
    featured: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Carregar produtos do Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
      
      // Fallback com produtos demo em caso de erro
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Whey Protein Premium',
          description: 'Proteína de alta qualidade para ganho de massa muscular',
          price: 89.90,
          category: 'Suplementos',
          stock_quantity: 25,
          image_url: '',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Suplementos',
      stock_quantity: '',
      image_url: '',
      is_active: true,
      featured: false
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url || '',
      is_active: product.is_active,
      featured: product.featured
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        featured: formData.featured
      };

      if (editingProduct) {
        // Atualizar produto existente no Supabase
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto no Supabase
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        
        toast.success('Produto criado com sucesso!');
      }

      setModalOpen(false);
      resetForm();
      loadProducts(); // Recarregar produtos
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Produto excluído com sucesso!');
      loadProducts(); // Recarregar produtos
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const toggleActive = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Status do produto atualizado!');
      loadProducts(); // Recarregar produtos
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  if (loading) {
    return (
      <div className="liquid-glass p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-1/3"></div>
          <div className="h-64 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="liquid-glass p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <ShoppingCart className="w-6 h-6 text-accent-ink" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-txt">Gestão de Produtos</h2>
              <p className="text-txt-2">Gerencie o catálogo da loja</p>
            </div>
          </div>
          <Button onClick={openCreateModal} className="liquid-glass-button" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="liquid-glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-accent mb-1">{products.length}</div>
            <div className="text-sm text-txt-2">Total de Produtos</div>
          </div>
          
          <div className="liquid-glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-accent mb-1">
              {products.filter(p => p.is_active).length}
            </div>
            <div className="text-sm text-txt-2">Produtos Ativos</div>
          </div>
          
          <div className="liquid-glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-accent mb-1">
              {products.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-txt-2">Em Destaque</div>
          </div>
          
          <div className="liquid-glass p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-accent mb-1">
              R$ {products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toFixed(0)}
            </div>
            <div className="text-sm text-txt-2">Valor Total</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="liquid-glass p-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-accent/20">
                <TableHead className="text-txt font-bold">Produto</TableHead>
                <TableHead className="text-txt font-bold">Categoria</TableHead>
                <TableHead className="text-txt font-bold text-center">Preço</TableHead>
                <TableHead className="text-txt font-bold text-center">Estoque</TableHead>
                <TableHead className="text-txt font-bold text-center">Status</TableHead>
                <TableHead className="text-txt font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id} className="border-b border-line/30 hover:bg-accent/5 transition-all">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-accent/20 to-accent-2/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-txt">{product.name}</div>
                        <div className="text-sm text-txt-2 max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-txt-2">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-accent">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={product.stock_quantity > 10 ? "default" : "destructive"}
                      className={product.stock_quantity > 10 ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {product.stock_quantity} un.
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant={product.is_active ? "default" : "secondary"}
                        className={product.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                      {product.featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="liquid-glass-button"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`liquid-glass-button ${product.is_active ? 'text-orange-400' : 'text-green-400'}`}
                        onClick={() => toggleActive(product.id)}
                      >
                        {product.is_active ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="liquid-glass-button text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="liquid-glass border-accent/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-txt flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                {editingProduct ? <Edit className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
              </div>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-txt-2 font-medium">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="liquid-glass-button mt-2"
                  placeholder="Ex: Whey Protein"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-txt-2 font-medium">Categoria *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-input-bg border border-input-border text-txt mt-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-txt-2 font-medium">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="liquid-glass-button mt-2"
                placeholder="Descreva o produto..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-txt-2 font-medium">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="liquid-glass-button mt-2"
                  placeholder="Ex: 89.90"
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-txt-2 font-medium">Estoque *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  className="liquid-glass-button mt-2"
                  placeholder="Ex: 25"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image" className="text-txt-2 font-medium">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="liquid-glass-button mt-2"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-accent bg-input-bg border-input-border rounded focus:ring-accent"
                />
                <Label htmlFor="active" className="text-txt-2">Produto ativo</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-accent bg-input-bg border-input-border rounded focus:ring-accent"
                />
                <Label htmlFor="featured" className="text-txt-2">Produto em destaque</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="liquid-glass-button">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-ink">
              <Save className="w-4 h-4 mr-2" />
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}