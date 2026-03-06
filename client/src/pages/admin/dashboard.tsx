import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Activity, ShoppingCart, RefreshCw, LogOut, ArrowUpRight, Package, Calendar, Eye, MousePointer2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
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
          <div className="flex gap-3">
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
                      <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest h-14 text-right px-6">Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.length > 0 ? (
                      completedOrders.map((lead: Lead) => (
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
                          <TableCell className="text-right px-6 py-5">
                            {lead.ttclid ? <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">TikTok</span> : <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Direct</span>}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-gray-400 font-medium">No completed orders yet.</TableCell>
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
      </div>
    </div>
  );
}
