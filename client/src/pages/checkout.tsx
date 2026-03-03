import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, Lock, ChevronRight, PackageCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    province: 'Sindh',
    country: 'Pakistan',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty and not currently confirming an order
  useEffect(() => {
    if (items.length === 0 && !orderConfirmed) {
      setLocation("/");
    }
  }, [items, orderConfirmed, setLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const phoneRegex = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{5,}$/;
    const cityRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!phoneRegex.test(formData.phone)) errors.phone = "Invalid Pakistani phone number format.";
    if (!nameRegex.test(formData.firstName)) errors.firstName = "First name should only contain letters.";
    if (!nameRegex.test(formData.lastName)) errors.lastName = "Last name should only contain letters.";
    if (!addressRegex.test(formData.address)) errors.address = "Please enter a valid address.";
    if (!cityRegex.test(formData.city)) errors.city = "City should only contain letters.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: items, // Sending all items
          shipping: formData,
          totalPrice: subtotal + 200 // Including shipping fee
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      // GTM Purchase Event Logic
      const hashData = async (text: string) => {
        const msgUint8 = new TextEncoder().encode(text.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      const trackPurchase = async () => {
        try {
          // @ts-ignore
          const gtag = window.gtag || ((...args: any[]) => { (window.dataLayer = window.dataLayer || []).push(args); });

          const hashedPhone = await hashData(formData.phone);
          const hashedFirstName = await hashData(formData.firstName);
          const hashedLastName = await hashData(formData.lastName);

          gtag('event', 'purchase', {
            transaction_id: `T_${Date.now()}`,
            value: subtotal + 200,
            currency: 'PKR',
            user_data: {
              sha256_phone_number: hashedPhone,
              address: {
                sha256_first_name: hashedFirstName,
                sha256_last_name: hashedLastName,
                city: formData.city,
                region: formData.province,
                postal_code: '00000',
                country: 'PK Pakistan'
              }
            },
            items: items.map(item => ({
              item_id: `SKU_${item.id}`,
              item_name: item.name,
              item_brand: 'Lumina Footwear',
              item_category: 'Shoes',
              price: item.price,
              quantity: item.quantity
            }))
          });
        } catch (e) {
          console.error("GTM Tracking Error:", e);
        }
      };

      await trackPurchase();

      setIsSubmitting(false);
      setOrderConfirmed(true);
      clearCart(); // Clear the cart after successful order
      toast({
        title: "Order Placed Successfully",
        description: "We have received your order details.",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0 && !orderConfirmed) return null;

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl shadow-2xl border-none">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your order has been confirmed and is being processed. Our team will contact you shortly on your provided phone number.
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
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (e.g. 03001234567 or +923001234567)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="03001234567"
                      required
                      className={`h-12 ${formErrors.phone ? 'border-red-500' : ''}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Country/Region</Label>
                    <div className="h-12 w-full px-3 py-2 border rounded-md bg-gray-50 flex items-center text-gray-500">
                      Pakistan
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className={`h-12 ${formErrors.firstName ? 'border-red-500' : ''}`} value={formData.firstName} onChange={handleInputChange} />
                    {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className={`h-12 ${formErrors.lastName ? 'border-red-500' : ''}`} value={formData.lastName} onChange={handleInputChange} />
                    {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required className={`h-12 ${formErrors.address ? 'border-red-500' : ''}`} value={formData.address} onChange={handleInputChange} />
                    {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" className="h-12" value={formData.apartment} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className={`h-12 ${formErrors.city ? 'border-red-500' : ''}`} value={formData.city} onChange={handleInputChange} />
                    {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <select
                      id="province"
                      className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.province}
                      onChange={handleInputChange}
                    >
                      <option value="Sindh">Sindh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                      <option value="AJK">Azad Kashmir (AJK)</option>
                      <option value="Islamabad">Islamabad Capital Territory</option>
                    </select>
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
                  {items.map((item) => (
                    <div key={`${item.variantId}-${item.size}`} className="flex items-center gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 relative">
                        <img src={item.image} alt={item.name} className="w-full h-auto mix-blend-multiply" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                      </div>
                      <p className="font-bold text-sm">PKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">PKR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-black font-medium">PKR 200.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-xs text-gray-500">Including taxes</p>
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-right">
                      <span className="text-xs text-gray-400 font-normal mr-2">PKR</span>
                      {(subtotal + 200).toFixed(2)}
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