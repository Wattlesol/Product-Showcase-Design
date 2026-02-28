import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, Lock, ChevronRight, PackageCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('checkout_item');
    if (data) setProduct(JSON.parse(data));
    else setLocation("/");
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API/Email processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setOrderConfirmed(true);
    toast({
      title: "Order Placed Successfully",
      description: "A confirmation email has been sent to your address.",
    });
  };

  if (!product) return null;

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl shadow-2xl border-none">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your order has been confirmed and is being processed. We've sent a confirmation email with your order details.
          </p>
          <Button onClick={() => setLocation("/")} className="w-full h-12 rounded-xl">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <span className="font-heading font-bold text-3xl tracking-tighter">LUMINA</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <p className="text-sm text-gray-500">Already have an account? <span className="underline cursor-pointer">Log in</span></p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required className="h-12" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="news" className="rounded" />
                    <Label htmlFor="news" className="text-sm font-normal">Email me with news and offers</Label>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className="h-12" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required className="h-12" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP code</Label>
                    <Input id="zip" required className="h-12" />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
                <div className="border border-black rounded-xl p-6 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border-4 border-black"></div>
                    <div>
                      <p className="font-bold">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-500">Pay with cash upon delivery</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-xl text-lg font-bold bg-black hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Order...' : 'Complete Order'}
                  {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-8 justify-center opacity-50">
              <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">Secure Payment</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">Privacy Protected</span></div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">Express Shipping</span></div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 relative">
                      <img src={product.image} alt={product.name} className="w-full h-auto mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Size: {product.size} | Color: {product.color}</p>
                    </div>
                    <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-green-600 font-medium">Calculated at next step</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-xs text-gray-500">Including taxes</p>
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-right">
                      <span className="text-xs text-gray-400 font-normal mr-2">USD</span>
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}