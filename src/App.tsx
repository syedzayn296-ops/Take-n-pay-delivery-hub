import { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, BarChart3, CheckCircle2, ChevronRight, ClipboardCheck,
  Clock3, MapPin, Package, Plus, ShoppingCart, Store, Truck, UserRound,
  Minus, Smartphone, X
} from 'lucide-react';

type Status = 'New' | 'Picking' | 'Packed' | 'Ready' | 'Assigned' | 'Out for delivery' | 'Delivered' | 'Problem';
type Mode = 'Customer' | 'Store' | 'Dispatch' | 'Management';

type Product = { id: string; name: string; category: string; price: number };
type CartItem = Product & { qty: number };
type Order = {
  id: string; customer: string; suburb: string; store: string; items: number;
  value: number; status: Status; eta: string; driver?: string; note?: string;
  fulfillment?: 'Delivery' | 'Collection'; itemSummary?: string;
};

const products: Product[] = [
  { id: 'milk', name: 'Full Cream Milk 2L', category: 'Dairy', price: 38.99 },
  { id: 'bread', name: 'White Bread 700g', category: 'Bakery', price: 19.99 },
  { id: 'rice', name: 'Long Grain Rice 2kg', category: 'Pantry', price: 49.99 },
  { id: 'chicken', name: 'Chicken Portions 2kg', category: 'Meat', price: 89.99 },
  { id: 'eggs', name: 'Large Eggs 18 Pack', category: 'Dairy', price: 54.99 },
  { id: 'oil', name: 'Cooking Oil 2L', category: 'Pantry', price: 69.99 },
  { id: 'sugar', name: 'White Sugar 2kg', category: 'Pantry', price: 39.99 },
  { id: 'cold', name: 'Cold Drink 2L', category: 'Drinks', price: 22.99 }
];

const initialOrders: Order[] = [
  { id: 'TNP-1042', customer: 'Customer A', suburb: 'Chatsworth', store: 'Chatsworth', items: 8, value: 684.50, status: 'New', eta: '—', fulfillment: 'Delivery', itemSummary: 'Mixed grocery basket' },
  { id: 'TNP-1041', customer: 'Customer B', suburb: 'Malvern', store: 'Chatsworth', items: 12, value: 923.20, status: 'Picking', eta: '—', fulfillment: 'Delivery', itemSummary: '12 grocery items' },
  { id: 'TNP-1039', customer: 'Customer C', suburb: 'Queensburgh', store: 'Chatsworth', items: 6, value: 412.00, status: 'Ready', eta: '35 min', fulfillment: 'Delivery', itemSummary: '6 grocery items' },
  { id: 'TNP-1037', customer: 'Customer D', suburb: 'Amanzimtoti', store: 'Amanzimtoti', items: 15, value: 1188.90, status: 'Assigned', eta: '42 min', driver: 'Driver 01', fulfillment: 'Delivery', itemSummary: '15 grocery items' },
  { id: 'TNP-1035', customer: 'Customer E', suburb: 'Isipingo', store: 'Amanzimtoti', items: 9, value: 576.40, status: 'Out for delivery', eta: '18 min', driver: 'Driver 02', fulfillment: 'Delivery', itemSummary: '9 grocery items' },
  { id: 'TNP-1031', customer: 'Customer F', suburb: 'Chatsworth', store: 'Chatsworth', items: 11, value: 745.80, status: 'Problem', eta: 'Delayed', driver: 'Driver 03', fulfillment: 'Delivery', itemSummary: '11 grocery items', note: 'Customer unavailable — call required' }
];

const nextStatus: Partial<Record<Status, Status>> = {
  New: 'Picking', Picking: 'Packed', Packed: 'Ready', Ready: 'Assigned',
  Assigned: 'Out for delivery', 'Out for delivery': 'Delivered'
};

const statusStyle: Record<Status, string> = {
  New: 'bg-blue-50 text-blue-700', Picking: 'bg-amber-50 text-amber-700',
  Packed: 'bg-violet-50 text-violet-700', Ready: 'bg-emerald-50 text-emerald-700',
  Assigned: 'bg-cyan-50 text-cyan-700', 'Out for delivery': 'bg-indigo-50 text-indigo-700',
  Delivered: 'bg-slate-100 text-slate-600', Problem: 'bg-red-50 text-red-700'
};

export default function App() {
  const [mode, setMode] = useState<Mode>('Customer');
  const [store, setStore] = useState('Chatsworth');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState('All');
  const [delivery, setDelivery] = useState<'Delivery' | 'Collection'>('Delivery');
  const [selected, setSelected] = useState<Order | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const visibleOrders = useMemo(
    () => store === 'All stores' ? orders : orders.filter(o => o.store === store),
    [orders, store]
  );

  const counts = {
    active: orders.filter(o => !['Delivered', 'Problem'].includes(o.status)).length,
    ready: orders.filter(o => o.status === 'Ready').length,
    drivers: orders.filter(o => ['Assigned', 'Out for delivery'].includes(o.status)).length,
    problems: orders.filter(o => o.status === 'Problem').length
  };

  const addToCart = (product: Product) => setCart(current => {
    const found = current.find(item => item.id === product.id);
    return found ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }];
  });

  const changeQty = (id: string, delta: number) => setCart(current =>
    current.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0)
  );

  const placeOrder = () => {
    if (!cart.length) return;
    const id = 'TNP-' + (1043 + orders.length);
    const order: Order = {
      id, customer: 'Demo Customer', suburb: delivery === 'Delivery' ? 'Isipingo' : store,
      store, items: cartCount, value: cartTotal, status: 'New', eta: delivery === 'Delivery' ? '45–60 min' : 'Ready notification', fulfillment: delivery,
      itemSummary: cart.map(item => `${item.qty}× ${item.name}`).join(' · ')
    };
    setOrders(current => [order, ...current]);
    setPlaced(id);
    setCart([]);
  };

  const advance = (id: string) => setOrders(current => current.map(order => {
    if (order.id !== id) return order;
    const status = nextStatus[order.status];
    return status ? { ...order, status, eta: status === 'Delivered' ? 'Complete' : order.eta } : order;
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Zayzana pilot concept</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Take N Pay — Digital Ordering & Fulfilment</h1>
              <p className="mt-1 text-sm text-slate-400">One connected journey: customer order → store fulfilment → dispatch → delivery or collection.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['Customer', 'Store', 'Dispatch', 'Management'] as Mode[]).map(item => (
                <button key={item} onClick={() => setMode(item)}
                  className={`rounded-xl px-3 py-2 text-sm font-bold ${mode === item ? 'bg-white text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {mode === 'Customer' && (
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div><p className="text-sm font-bold text-amber-400">SHOP FROM TAKE N PAY</p><h2 className="mt-1 text-2xl font-black">Your groceries, your way.</h2><p className="mt-1 text-sm text-slate-300">Choose a store, build a basket, then collect or request delivery.</p></div>
              <div className="flex items-center gap-2"><Store className="h-5 w-5" /><select value={store} onChange={e => setStore(e.target.value)} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-900"><option>Chatsworth</option><option>Amanzimtoti</option><option>Arbour Town</option></select></div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-xs font-bold ${category === item ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>{item}</button>)}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map(product => <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Package /></div>
                  <p className="mt-3 font-black">{product.name}</p><p className="mt-1 text-xs text-slate-500">{product.category}</p>
                  <div className="mt-3 flex items-center justify-between"><span className="font-black">R{product.price.toFixed(2)}</span><button onClick={() => addToCart(product)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"><Plus className="mr-1 inline h-4 w-4" />Add</button></div>
                </div>)}
              </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="font-black">Your basket</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{cartCount} items</span></div>
              {cart.length === 0 ? <div className="py-10 text-center text-sm text-slate-500"><ShoppingCart className="mx-auto h-8 w-8 opacity-40" /><p className="mt-2">Add products to build a demo order.</p></div> :
                <div className="mt-4 space-y-3">{cart.map(item => <div key={item.id} className="flex items-center justify-between gap-2"><div><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-slate-500">R{(item.price * item.qty).toFixed(2)}</p></div><div className="flex items-center gap-2"><button onClick={() => changeQty(item.id, -1)} className="rounded-lg bg-slate-100 p-1"><Minus className="h-4 w-4" /></button><span className="w-4 text-center text-sm font-bold">{item.qty}</span><button onClick={() => changeQty(item.id, 1)} className="rounded-lg bg-slate-100 p-1"><Plus className="h-4 w-4" /></button></div></div>)}</div>}
              <div className="mt-5 border-t pt-4"><div className="flex justify-between font-black"><span>Basket total</span><span>R{cartTotal.toFixed(2)}</span></div>
                <div className="mt-4 grid grid-cols-2 gap-2">{(['Delivery', 'Collection'] as const).map(item => <button key={item} onClick={() => setDelivery(item)} className={`rounded-xl border px-3 py-2 text-sm font-bold ${delivery === item ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200'}`}>{item}</button>)}</div>
                <button disabled={!cart.length} onClick={placeOrder} className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40">Place demo order</button>
              </div>
            </aside>
          </div>
        </main>
      )}

      {mode === 'Store' && <Operations title="Store fulfilment" subtitle="New digital orders appear here for the store team to pick, pack and prepare." orders={visibleOrders} store={store} setStore={setStore} selected={selected} setSelected={setSelected} advance={advance} />}
      {mode === 'Dispatch' && <Dispatch orders={orders} setOrders={setOrders} selected={selected} setSelected={setSelected} />}
      {mode === 'Management' && <Management orders={orders} counts={counts} />}

      {placed && <div className="fixed inset-0 z-50 bg-slate-950/50 p-4" onClick={() => setPlaced(null)}><div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}><CheckCircle2 className="h-10 w-10 text-emerald-600" /><h2 className="mt-3 text-2xl font-black">Order received</h2><p className="mt-2 text-sm text-slate-600">Demo order <b>{placed}</b> has entered the Take N Pay fulfilment workflow. Nothing is connected to live Take N Pay systems.</p><button onClick={() => { setPlaced(null); setMode('Store'); }} className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Show store order</button></div></div>}
    </div>
  );
}

function Operations({ title, subtitle, orders, store, setStore, selected, setSelected, advance }: any) {
  const counts = { new: orders.filter((o: Order) => o.status === 'New').length, picking: orders.filter((o: Order) => ['Picking','Packed'].includes(o.status)).length, ready: orders.filter((o: Order) => o.status === 'Ready').length };
  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div><select value={store} onChange={(e: any) => setStore(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold"><option>All stores</option><option>Chatsworth</option><option>Amanzimtoti</option><option>Arbour Town</option></select></div>
    <div className="grid grid-cols-3 gap-3"><Metric icon={<Package />} label="New" value={counts.new} /><Metric icon={<ClipboardCheck />} label="Picking / packed" value={counts.picking} /><Metric icon={<CheckCircle2 />} label="Ready" value={counts.ready} /></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b px-4 py-4"><h3 className="font-black">Store order queue</h3></div>{orders.map((order: Order) => <button key={order.id} onClick={() => setSelected(order)} className="block w-full border-b px-4 py-4 text-left last:border-0 hover:bg-slate-50"><div className="grid gap-2 sm:grid-cols-[120px_1fr_auto] sm:items-center"><div><b>{order.id}</b><p className="text-xs text-slate-500">{order.items} items · R{order.value.toFixed(2)}</p></div><div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[order.status]}`}>{order.status}</span><p className="mt-1 text-xs text-slate-500">{order.customer} · {order.suburb} · {order.fulfillment || 'Delivery'}</p></div><ChevronRight className="hidden h-5 w-5 text-slate-300 sm:block" /></div></button>)}</div>
    {selected && <OrderModal order={selected} close={() => setSelected(null)} advance={advance} />}
  </main>;
}

function Dispatch({ orders, setOrders, selected, setSelected }: any) {
  const jobs = orders.filter((o: Order) => ['Ready','Assigned','Out for delivery','Problem'].includes(o.status));
  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
    <div><h2 className="text-2xl font-black">Dispatch & delivery</h2><p className="text-sm text-slate-500">Turn store-ready orders into controlled delivery jobs.</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric icon={<ClipboardCheck />} label="Ready" value={orders.filter((o: Order) => o.status === 'Ready').length} /><Metric icon={<Truck />} label="Driver jobs" value={orders.filter((o: Order) => ['Assigned','Out for delivery'].includes(o.status)).length} /><Metric icon={<Clock3 />} label="In transit" value={orders.filter((o: Order) => o.status === 'Out for delivery').length} /><Metric icon={<AlertTriangle />} label="Problems" value={orders.filter((o: Order) => o.status === 'Problem').length} /></div>
    <div className="grid gap-4 md:grid-cols-2">{jobs.map((order: Order) => <button key={order.id} onClick={() => setSelected(order)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-slate-300"><div className="flex items-center justify-between"><b>{order.id}</b><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[order.status]}`}>{order.status}</span></div><p className="mt-3 text-sm font-bold">{order.store} → {order.suburb}</p><p className="mt-1 text-xs text-slate-500">{order.items} items · R{order.value.toFixed(2)} · ETA {order.eta}</p><p className="mt-3 text-xs text-slate-500">{order.driver ? `Driver: ${order.driver}` : 'Awaiting driver assignment'}</p></button>)}</div>
    {selected && <OrderModal order={selected} close={() => setSelected(null)} advance={(id: string) => { setOrders((current: Order[]) => current.map(o => o.id === id ? { ...o, status: nextStatus[o.status] || o.status, driver: o.driver || 'Driver 04' } : o)); setSelected(null); }} />}
  </main>;
}

function Management({ orders, counts }: { orders: Order[]; counts: any }) {
  const total = orders.reduce((sum, o) => sum + o.value, 0);
  const avg = orders.length ? total / orders.length : 0;
  const delivery = orders.filter(o => o.suburb !== o.store).length;
  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
    <div><h2 className="text-2xl font-black">Management view</h2><p className="text-sm text-slate-500">A pilot-level view of demand, order value and operational load.</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric icon={<ShoppingCart />} label="Orders" value={orders.length} /><Metric icon={<BarChart3 />} label="Order value" value={Math.round(total)} prefix="R" /><Metric icon={<Package />} label="Avg basket" value={Math.round(avg)} prefix="R" /><Metric icon={<Truck />} label="Delivery orders" value={delivery} /></div>
    <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black">Pilot questions this screen can measure</h3><div className="mt-4 space-y-3"><Info label="Demand" text="How many customers choose digital ordering?" /><Info label="Basket" text="What is the average digital order value?" /><Info label="Operations" text="How long from order received to ready?" /><Info label="Delivery" text="How many orders require delivery and where?" /><Info label="Repeat use" text="Do customers come back to order again?" /></div></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-amber-800">Pilot principle</p><p className="mt-2 text-sm leading-6 text-amber-950">This is a prototype using sample data. A real pilot would connect to Take N Pay's existing stock, pricing, payment and fulfilment processes only after requirements are agreed.</p></div></div>
  </main>;
}

function OrderModal({ order, close, advance }: { order: Order; close: () => void; advance: (id: string) => void }) {
  const next = nextStatus[order.status];
  return <div className="fixed inset-0 z-50 bg-slate-950/50 p-4" onClick={close}><div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order</p><h2 className="text-2xl font-black">{order.id}</h2></div><button onClick={close}><X /></button></div><div className="mt-5 space-y-3"><Detail icon={<UserRound />} label="Customer" value={order.customer} /><Detail icon={<MapPin />} label="Route" value={`${order.store} → ${order.suburb}`} /><Detail icon={<Package />} label="Order" value={`${order.items} items · R${order.value.toFixed(2)}`} />{order.itemSummary && <Detail icon={<ShoppingCart />} label="Basket" value={order.itemSummary} />}<Detail icon={<Smartphone />} label="Fulfilment" value={order.fulfillment || 'Delivery'} /><Detail icon={<Clock3 />} label="ETA" value={order.eta} />{order.driver && <Detail icon={<Truck />} label="Driver" value={order.driver} />}</div>{next && <button onClick={() => { advance(order.id); close(); }} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Move to {next}</button>}{order.status === 'Problem' && <button onClick={() => { advance(order.id); close(); }} className="mt-3 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white">Resolve problem</button>}</div></div>;
}

function Metric({ icon, label, value, prefix = '' }: { icon: React.ReactNode; label: string; value: number; prefix?: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-slate-400">{icon}<span className="text-xs font-bold">{label}</span></div><p className="mt-2 text-2xl font-black">{prefix}{value.toLocaleString()}</p></div>;
}
function Info({ label, text }: { label: string; text: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-black">{label}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div>; }
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="text-slate-400">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="font-semibold">{value}</p></div></div>; }
