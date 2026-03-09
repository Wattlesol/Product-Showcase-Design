import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Activity, ShoppingCart, RefreshCw, LogOut, ArrowUpRight, Package, Calendar, Eye, MousePointer2, Database, Download, Edit2, MessageSquare, ChevronDown, ChevronUp, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Lead {
  sessionId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  totalPrice: string;
  lastUpdated: string;
  status: string;
  ttclid?: string;
  utmSource?: string;
  cartItems: any[];
  ipAddress?: string;
}

interface Comment {
  id: string;
  sessionId: string;
  comment: string;
  author: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  metadata?: string;
}

interface EditItem {
  variantId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image?: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showDatePopover, setShowDatePopover] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Lead | null>(null);
  const [editItems, setEditItems] = useState<EditItem[]>([]);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    status: "pending",
  });
  
  // Comments state
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Products for edit modal
  const [products, setProducts] = useState<Product[]>([]);

  const fetchStats = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    setIsSyncing(true);
    try {
      const resp = await fetch("/api/admin/stats", {
        headers: { Authorization: token },
      });
      if (resp.ok) {
        const data = await resp.json();
        setStats(data);
      } else {
        localStorage.removeItem("admin_token");
        setLocation("/admin/login");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const resp = await fetch("/api/products");
      if (resp.ok) {
        const data = await resp.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  };
  
  // Filter orders by date
  const filterOrdersByDate = (orders: Lead[]) => {
    if (!dateFilter.from || !dateFilter.to) return orders;
    
    // Set end date to end of day
    const endDate = new Date(dateFilter.to);
    endDate.setHours(23, 59, 59, 999);
    
    return orders.filter(order => {
      const orderDate = new Date(order.lastUpdated);
      return orderDate >= dateFilter.from! && orderDate <= endDate;
    });
  };
  
  // Export orders to CSV
  const exportOrdersToCSV = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    try {
      const resp = await fetch("/api/admin/stats", {
        headers: { Authorization: token },
      });
      if (!resp.ok) return;
      
      const data = await resp.json();
      let orders = data.completedOrders || [];
      
      // Apply date filter
      orders = filterOrdersByDate(orders);
      
      if (orders.length === 0) {
        alert("No orders to export for the selected date range.");
        return;
      }
      
      // Fetch comments for all orders
      const commentsMap: Record<string, Comment[]> = {};
      for (const order of orders) {
        try {
          const commentsResp = await fetch(`/api/admin/orders/${order.sessionId}/comments`, {
            headers: { Authorization: token },
          });
          if (commentsResp.ok) {
            commentsMap[order.sessionId] = await commentsResp.json();
          }
        } catch (e) {
          console.error(`Failed to fetch comments for order ${order.sessionId}`);
        }
      }
      
      // Build CSV
      const headers = [
        "Order ID",
        "Date",
        "Status",
        "First Name",
        "Last Name",
        "Phone",
        "Address",
        "City",
        "Province",
        "IP Address",
        "Source",
        "Items",
        "Total Price (PKR)",
        "Comments"
      ];
      
      const rows = orders.map((order: Lead) => {
        const items = order.cartItems
          .map((item: any) => `${item.quantity}x ${item.name} (${item.color}, Size ${item.size}) - PKR ${item.price}`)
          .join(" | ");
        
        const orderComments = (commentsMap[order.sessionId] || [])
          .map((c: Comment) => `[${new Date(c.createdAt).toLocaleString()}] ${c.author}: ${c.comment}`)
          .join(" || ");
        
        return [
          `LMN-${order.sessionId.slice(-6).toUpperCase()}`,
          new Date(order.lastUpdated).toLocaleString(),
          order.status,
          order.firstName || "",
          order.lastName || "",
          order.phone || "",
          order.address || "",
          order.city || "",
          order.province || "",
          order.ipAddress || "",
          order.ttclid ? "TikTok" : "Direct",
          items,
          order.totalPrice,
          orderComments
        ].map(cell => `"${String(cell).replace(/"/g, '""')}"`); // Escape quotes
      });
      
      const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
      
      // Download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_export_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (e) {
      console.error("Export failed:", e);
      alert("Failed to export orders. Please try again.");
    }
  };
  
  // Fetch comments for an order
  const fetchOrderComments = async (sessionId: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    try {
      const resp = await fetch(`/api/admin/orders/${sessionId}/comments`, {
        headers: { Authorization: token },
      });
      if (resp.ok) {
        const data = await resp.json();
        setComments(prev => ({ ...prev, [sessionId]: data }));
      }
    } catch (e) {
      console.error("Failed to fetch comments:", e);
    }
  };
  
  // Add comment to order
  const addComment = async (sessionId: string) => {
    const token = localStorage.getItem("admin_token");
    const commentText = commentInputs[sessionId] || "";
    
    if (!token || !commentText.trim()) return;

    try {
      const resp = await fetch(`/api/admin/orders/${sessionId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ comment: commentText.trim(), author: "admin" }),
      });

      if (resp.ok) {
        const addedComment = await resp.json();
        setComments(prev => ({
          ...prev,
          [sessionId]: [addedComment, ...(prev[sessionId] || [])]
        }));
        setCommentInputs(prev => ({ ...prev, [sessionId]: "" }));
      } else {
        const error = await resp.json();
        console.error("Failed to add comment:", error);
        alert("Failed to add comment. Please try again.");
      }
    } catch (e) {
      console.error("Failed to add comment:", e);
      alert("Failed to add comment. Please try again.");
    }
  };
  
  // Toggle comments section
  const toggleComments = (sessionId: string) => {
    if (expandedComments === sessionId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(sessionId);
      if (!comments[sessionId]) {
        fetchOrderComments(sessionId);
      }
    }
  };
  
  // Open edit modal
  const openEditModal = (order: Lead) => {
    setEditingOrder(order);
    setEditForm({
      firstName: order.firstName || "",
      lastName: order.lastName || "",
      phone: order.phone || "",
      address: order.address || "",
      city: order.city || "",
      province: order.province || "",
      status: order.status || "pending",
    });
    setEditItems(order.cartItems.map((item: any) => ({
      variantId: item.variantId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
      image: item.image,
    })));
    setIsEditModalOpen(true);
  };
  
  // Update item in edit modal
  const updateEditItem = (index: number, field: keyof EditItem, value: any) => {
    const newItems = [...editItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditItems(newItems);
  };
  
  // Remove item from edit modal
  const removeEditItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };
  
  // Add new item to edit modal
  const addEditItem = () => {
    if (products.length === 0) return;
    const product = products[0];
    const metadata = product.metadata ? JSON.parse(product.metadata) : {};
    const variants = metadata.variants || [];
    const variant = variants[0] || {};
    const sizes = variant.sizes || [];
    
    setEditItems([...editItems, {
      variantId: variant.id || product.id,
      name: product.name,
      size: sizes[0] || "M",
      color: variant.color || "Default",
      quantity: 1,
      price: parseFloat(product.price) || 0,
      image: variant.images?.[0],
    }]);
  };
  
  // Calculate total
  const calculateTotal = () => {
    return editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // Save edited order
  const saveEditedOrder = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token || !editingOrder) return;
    
    try {
      const updateData = {
        ...editForm,
        cartItems: JSON.stringify(editItems),
        totalPrice: String(calculateTotal()),
      };
      
      const resp = await fetch(`/api/admin/orders/${editingOrder.sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updateData),
      });
      
      if (resp.ok) {
        await fetchStats();
        setIsEditModalOpen(false);
        setEditingOrder(null);
      } else {
        alert("Failed to update order. Please try again.");
      }
    } catch (e) {
      console.error("Failed to save order:", e);
      alert("Failed to save order. Please try again.");
    }
  };
  
  // Quick date filter presets
  const applyDatePreset = (preset: string) => {
    const now = new Date();
    let from = new Date();
    let to = now;
    
    switch (preset) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7days":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        from = null;
        to = null;
        break;
    }
    
    setDateFilter({ from, to });
    setShowDatePopover(false);
  };
  
  // Get date filter label
  const getDateFilterLabel = () => {
    if (!dateFilter.from && !dateFilter.to) return "All Time";
    if (dateFilter.from && dateFilter.to) {
      return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
    }
    return "Custom";
  };

  if (isLoading) return <div className="p-8 text-center font-heading">Loading dashboard...</div>;

  const abandonedLeads = stats?.leads || [];
  const completedOrders = stats?.completedOrders || [];
  const userJourneys = stats?.userJourneys || [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">Lumina Intelligence</h1>
            <p className="text-gray-500 font-medium">Precision tracking & order management panel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover open={showDatePopover} onOpenChange={setShowDatePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center min-w-[140px]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {getDateFilterLabel()}
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => applyDatePreset("today")}>Today</Button>
                    <Button size="sm" variant="outline" onClick={() => applyDatePreset("7days")}>Last 7 Days</Button>
                    <Button size="sm" variant="outline" onClick={() => applyDatePreset("30days")}>Last 30 Days</Button>
                    <Button size="sm" variant="outline" onClick={() => applyDatePreset("all")}>All Time</Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">From</Label>
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter.from || undefined}
                        onSelect={(date) => setDateFilter({ ...dateFilter, from: date || null })}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">To</Label>
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter.to || undefined}
                        onSelect={(date) => setDateFilter({ ...dateFilter, to: date || null })}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              onClick={exportOrdersToCSV}
              className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center min-w-[120px]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
            
            <Button
              variant="outline"
              onClick={fetchStats}
              disabled={isSyncing}
              className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center min-w-[100px]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" /> Exit
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-3xl border-none shadow-sm bg-white p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Reach</CardTitle>
              <Users className="w-4 h-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">{stats?.totalVisitors || 0}</div>
              <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                <Database className="w-3 h-3 text-green-500" /> Database Live
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none shadow-sm bg-white p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-400">Collective Views</CardTitle>
              <Eye className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">{stats?.productViews || 0}</div>
              <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-tighter">Total Explorations</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none shadow-sm bg-white p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-400">Collective Carts</CardTitle>
              <MousePointer2 className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">{stats?.addToCarts || 0}</div>
              <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-tighter">Items Added</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none shadow-sm bg-black text-white p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-400">Collective Abandoned</CardTitle>
              <ShoppingCart className="w-4 h-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">{stats?.abandonedCarts || 0}</div>
              <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-tighter">Lost Carts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="journeys" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 h-14 w-full md:w-auto shadow-sm overflow-x-auto flex-nowrap scrollbar-hide">
            <TabsTrigger value="journeys" className="rounded-xl px-6 h-full data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest shrink-0">
              User Journeys
            </TabsTrigger>
            <TabsTrigger value="leads" className="rounded-xl px-6 h-full data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest shrink-0">
              Abandoned ({abandonedLeads.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl px-6 h-full data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest shrink-0">
              Orders ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="popular" className="rounded-xl px-6 h-full data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest shrink-0">
              Popularity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journeys">
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b border-gray-100 font-heading">
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 px-6">Visitor Info</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Journey</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Cart Items</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Lead Status</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userJourneys.length > 0 ? (
                      userJourneys.map((j: any) => (
                        <TableRow key={j.ip} className="group border-b border-gray-50/50 last:border-0 hover:bg-gray-50/30 transition-colors">
                          <TableCell className="px-6 py-5">
                            <div className="font-mono text-[11px] font-black text-black">{j.ip}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{new Date(j.startTime).toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[300px]">
                              {j.views.length > 0 ? Array.from(new Set(j.views)).map((v: any, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">{String(v)}</span>
                              )) : <span className="text-gray-300 text-[10px]">No views</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* Show actual current cart from lead record – NOT historical events */}
                            <div className="flex flex-col gap-1.5">
                              {j.cartItems && j.cartItems.length > 0 ? (
                                j.cartItems.map((item: any, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-[10px] leading-tight">{item.name}</div>
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <span className="font-mono text-[9px] bg-black text-white px-1 py-0.5 rounded">{item.variantId?.toUpperCase()}</span>
                                        <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1 py-0.5 rounded font-bold">SZ {item.size}</span>
                                        <span className="text-[9px] text-gray-400 font-bold">×{item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-300 text-[10px] italic">Empty</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {j.lead ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-xs">{j.lead.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{j.lead.phone}</span>
                                {j.lead.address && (
                                  <div className="mt-1 p-1.5 bg-gray-50 rounded text-[9px] text-gray-500 leading-snug border border-gray-100">
                                    <span className="font-bold text-gray-700">{j.lead.address}</span><br />
                                    {j.lead.location}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300 text-[10px] italic">Untracked</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right px-6">
                            {j.lead?.status === 'ordered' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black bg-green-500 text-white uppercase tracking-tighter shadow-sm">
                                Ordered
                              </span>
                            ) : j.lead ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black bg-amber-500 text-white uppercase tracking-tighter shadow-sm">
                                Lead
                              </span>
                            ) : (
                              <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Browsing</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-gray-300 font-medium italic">No journeys tracked yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 px-6">Customer & Address</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Contact / IP</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Cart Items Detail</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right">Value</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Source</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abandonedLeads.length > 0 ? (
                      abandonedLeads.map((lead: Lead) => (
                        <TableRow key={lead.sessionId} className="group border-b border-gray-50/50 last:border-0 hover:bg-gray-50/30 transition-colors align-top">
                          <TableCell className="px-6 py-5">
                            <div className="font-bold text-sm">
                              {lead.firstName} {lead.lastName}
                              {(!lead.firstName && !lead.lastName) && <span className="text-gray-400 italic font-normal">Unknown Buyer</span>}
                            </div>
                            {lead.address ? (
                              <div className="mt-1.5 p-2 bg-amber-50 rounded-lg border border-amber-100 text-[10px] text-amber-700 leading-relaxed">
                                <span className="font-bold block">{lead.address}</span>
                                {lead.city}, {lead.province}, Pakistan
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{lead.city || 'No address yet'}</div>
                            )}
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="font-medium text-sm">{lead.phone || '—'}</div>
                            <div className="font-mono text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 w-fit mt-1">{lead.ipAddress || 'unknown'}</div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex flex-col gap-2">
                              {lead.cartItems && lead.cartItems.length > 0 ? (
                                lead.cartItems.map((item: any, i: number) => (
                                  <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-[11px] leading-tight">{item.name}</div>
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <span className="font-mono text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-bold">{item.variantId?.toUpperCase()}</span>
                                        <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-bold">SZ {item.size}</span>
                                        <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded font-bold">{item.color}</span>
                                        <span className="text-[9px] text-gray-400 font-bold">×{item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs italic">Empty cart</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold py-5">
                            {lead.totalPrice ? `PKR ${lead.totalPrice}` : '—'}
                          </TableCell>
                          <TableCell className="py-5">
                            {lead.ttclid ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-black text-white uppercase tracking-tighter">
                                TikTok Ad
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Direct</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right px-6 py-5">
                            <Button variant="outline" size="sm" className="rounded-full h-9 px-4 border-black text-black font-bold hover:bg-black hover:text-white transition-all shadow-sm" onClick={() => lead.phone && window.open(`tel:${lead.phone}`, '_blank')} disabled={!lead.phone}>
                              CALL NOW
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-gray-400 font-medium">No abandoned carts found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b border-gray-100">
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 px-6">Order ID</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Customer & Address</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Ordered Items</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right">Total</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Date</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14">Status</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterOrdersByDate(completedOrders).length > 0 ? (
                      filterOrdersByDate(completedOrders).map((lead: Lead) => (
                        <>
                          <TableRow key={lead.sessionId} className="border-b border-gray-50/50 last:border-0 hover:bg-gray-50/30 transition-colors align-top">
                            <TableCell className="px-6 py-5">
                              <span className="font-black text-xs uppercase tracking-tighter bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg">✓ #LMN-{lead.sessionId.slice(-6).toUpperCase()}</span>
                              <div className="text-[10px] text-gray-400 font-mono mt-1.5">{lead.ipAddress || '—'}</div>
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="font-bold text-sm">{lead.firstName} {lead.lastName}</div>
                              <div className="text-xs text-gray-600 font-medium">{lead.phone}</div>
                              {lead.address && (
                                <div className="mt-1.5 p-2 bg-gray-50 rounded-lg border border-gray-100 text-[10px] text-gray-500 leading-relaxed">
                                  <span className="font-bold text-gray-700 block">{lead.address}</span>
                                  {lead.city}, {lead.province}, Pakistan
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="flex flex-col gap-2">
                                {lead.cartItems && lead.cartItems.length > 0 ? (
                                  lead.cartItems.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-[11px] leading-tight">{item.name}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                          <span className="font-mono text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-bold">{item.variantId?.toUpperCase()}</span>
                                          <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-bold">SZ {item.size}</span>
                                          <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded font-bold">{item.color}</span>
                                          <span className="text-[9px] text-gray-400 font-bold">×{item.quantity}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs italic">No items</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600 py-5">
                              PKR {lead.totalPrice}
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                <Calendar className="w-3 h-3" />
                                {new Date(lead.lastUpdated).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <Badge variant={lead.status === "completed" ? "default" : "secondary"} className="uppercase text-[9px] font-black tracking-tighter">
                                {lead.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`rounded-lg h-9 px-3 font-bold transition-all border ${expandedComments === lead.sessionId ? 'bg-black text-white' : 'border-gray-200 bg-white text-gray-700'}`}
                                  onClick={() => toggleComments(lead.sessionId)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  {comments[lead.sessionId]?.length || 0}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg h-9 px-3 border-black text-black font-bold hover:bg-black hover:text-white transition-all"
                                  onClick={() => openEditModal(lead)}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {/* Comments Row */}
                          {expandedComments === lead.sessionId && (
                            <TableRow className="bg-gray-50/50 border-b border-gray-100">
                              <TableCell colSpan={7} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Comments</span>
                                  </div>

                                  {/* Existing Comments - Read Only Timeline */}
                                  <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {(comments[lead.sessionId] || []).length > 0 ? (
                                      comments[lead.sessionId].map((comment: Comment) => (
                                        <div key={comment.id} className="flex gap-3">
                                          {/* Timeline Date/Time - Left Side */}
                                          <div className="flex-shrink-0 w-32 pt-2">
                                            <div className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">
                                              {format(new Date(comment.createdAt), "MMM d, yyyy")}
                                            </div>
                                            <div className="text-[9px] text-gray-300 font-mono">
                                              {format(new Date(comment.createdAt), "h:mm a")}
                                            </div>
                                          </div>
                                          
                                          {/* Timeline Line */}
                                          <div className="flex-shrink-0 w-px bg-gray-200 h-full mt-1"></div>
                                          
                                          {/* Comment Card */}
                                          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                <MessageSquare className="w-3 h-3 text-white" />
                                              </div>
                                              <span className="text-[10px] font-bold uppercase text-gray-600">{comment.author}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-8">
                                        <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400 italic">No comments yet. Add the first comment below.</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Add Comment */}
                                  <div className="flex gap-2">
                                    <Textarea
                                      value={commentInputs[lead.sessionId] || ""}
                                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [lead.sessionId]: e.target.value }))}
                                      placeholder="Add a note about this order..."
                                      className="min-h-[60px] text-sm"
                                    />
                                    <Button
                                      onClick={() => addComment(lead.sessionId)}
                                      disabled={!(commentInputs[lead.sessionId] || "").trim()}
                                      className="bg-black text-white hover:bg-gray-800 rounded-lg px-4"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-20 text-gray-400 font-medium">
                          {dateFilter.from || dateFilter.to ? "No completed orders for the selected date range." : "No completed orders yet."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular">
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b border-gray-100">
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 px-6">Product Name</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right">Views</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right">Add to Carts</TableHead>
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right px-6">Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.popularProducts?.length > 0 ? (
                      stats.popularProducts.map((p: any) => (
                        <TableRow key={p.id} className="border-b border-gray-50/50 last:border-0 hover:bg-gray-50/30 transition-colors">
                          <TableCell className="px-6 py-5">
                            <div className="font-bold uppercase tracking-tight">{p.name || "Unknown Product"}</div>
                            <div className="text-[10px] text-gray-400 font-mono">ID: {p.id}</div>
                          </TableCell>
                          <TableCell className="text-right font-medium">{p.views}</TableCell>
                          <TableCell className="text-right font-medium">{p.carts}</TableCell>
                          <TableCell className="text-right px-6">
                            <span className="font-black text-xs text-black bg-gray-100 px-3 py-1 rounded-full">
                              {p.views > 0 ? ((p.carts / p.views) * 100).toFixed(1) : "0"}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-gray-400 font-medium">No product data available yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Order Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                Edit Order #{editingOrder?.sessionId.slice(-6).toUpperCase()}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Customer Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Customer Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] uppercase font-bold">First Name</Label>
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold">Last Name</Label>
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold">Phone</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold">Status</Label>
                    <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] uppercase font-bold">Address</Label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold">City</Label>
                    <Input
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold">Province</Label>
                    <Input
                      value={editForm.province}
                      onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Order Items</h3>
                  <Button variant="outline" size="sm" onClick={addEditItem} className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {editItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                      )}
                      <div className="flex-1 grid grid-cols-5 gap-2">
                        <div className="col-span-2">
                          <Label className="text-[9px] uppercase font-bold">Product</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateEditItem(index, "name", e.target.value)}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase font-bold">Size</Label>
                          <Input
                            value={item.size}
                            onChange={(e) => updateEditItem(index, "size", e.target.value)}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase font-bold">Color</Label>
                          <Input
                            value={item.color}
                            onChange={(e) => updateEditItem(index, "color", e.target.value)}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase font-bold">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateEditItem(index, "quantity", parseInt(e.target.value) || 0)}
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <Label className="text-[9px] uppercase font-bold">Price</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateEditItem(index, "price", parseFloat(e.target.value) || 0)}
                            className="text-xs h-8 w-20"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditItem(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end items-center gap-4 pt-3 border-t">
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-500">Total:</span>
                    <span className="text-2xl font-black text-black ml-2">PKR {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={saveEditedOrder} className="rounded-xl bg-black text-white hover:bg-gray-800">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
