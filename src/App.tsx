import { useMemo, useState } from 'react';
import { Package, ClipboardCheck, Truck, CheckCircle2, AlertTriangle, MapPin, Clock3, ChevronRight, UserRound } from 'lucide-react';

type Status = 'New' | 'Picking' | 'Packed' | 'Ready' | 'Assigned' | 'Out for delivery' | 'Delivered' | 'Problem';

type Order = {
  id: string;
  customer: string;
  suburb: string;
  store: string;
  items: number;
  value: number;
  status: Status;
  eta: string;
  driver?: string;
  note?: string;
};

const initialOrders: Order[] = [
  { id: 'TNP-1042', customer: 'Customer A', suburb: 'Chatsworth', store: 'Chatsworth', items: 8, value: 684.50, status: 'New', eta: '—' },
  { id: 'TNP-1041', customer: 'Customer B', suburb: 'Malvern', store: 'Chatsworth', items: 12, value: 923.20, status: 'Picking', eta: '—' },
  { id: 'TNP-1039', customer: 'Customer C', suburb: 'Queensburgh', store: 'Chatsworth', items: 6, value: 412.00, status: 'Ready', eta: '35 min' },
  { id: 'TNP-1037', customer: 'Customer D', suburb: 'Amanzimtoti', store: 'Amanzimtoti', items: 15, value: 1188.90, status: 'Assigned', eta: '42 min', driver: 'Driver 01' },
  { id: 'TNP-1035', customer: 'Customer E', suburb: 'Isipingo', store: 'Amanzimtoti', items: 9, value: 576.40, status: 'Out for delivery', eta: '18 min', driver: 'Driver 02' },
  { id: 'TNP-1031', customer: 'Customer F', suburb: 'Chatsworth', store: 'Chatsworth', items: 11, value: 745.80, status: 'Problem', eta: 'Delayed', driver: 'Driver 03', note: 'Customer unavailable — call required' }
];

const nextStatus: Partial<Record<Status, Status>> = {
  New: 'Picking',
  Picking: 'Packed',
  Packed: 'Ready',
  Ready: 'Assigned',
  Assigned: 'Out for delivery',
  'Out for delivery': 'Delivered'
};

const statusStyle: Record<Status, string> = {
  New: 'bg-blue-50 text-blue-700',
  Picking: 'bg-amber-50 text-amber-700',
  Packed: 'bg-violet-50 text-violet-700',
  Ready: 'bg-emerald-50 text-emerald-700',
  Assigned: 'bg-cyan-50 text-cyan-700',
  'Out for delivery': 'bg-indigo-50 text-indigo-700',
  Delivered: 'bg-slate-100 text-slate-600',
  Problem: 'bg-red-50 text-red-700'
};

export default function App() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [store, setStore] = useState('All stores');
  const [selected, setSelected] = useState<Order | null>(null);

  const visible = useMemo(
    () => store === 'All stores' ? orders : orders.filter(o => o.store === store),
    [orders, store]
  );

  const counts = {
    active: orders.filter(o => !['Delivered', 'Problem'].includes(o.status)).length,
    ready: orders.filter(o => o.status === 'Ready').length,
    drivers: orders.filter(o => ['Assigned', 'Out for delivery'].includes(o.status)).length,
    problems: orders.filter(o => o.status === 'Problem').length
  };

  const advance = (id: string) => {
    setOrders(current => current.map(order => {
      if (order.id !== id) return order;
      const status = nextStatus[order.status];
      return status ? { ...order, status, eta: status === 'Delivered' ? 'Complete' : order.eta } : order;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Zayzana Delivery Control</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Take N Pay — Operations Hub</h1>
              <p className="mt-1 text-sm text-slate-400">A delivery and dispatch layer around the existing Take N Pay operation.</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={store} onChange={e => setStore(e.target.value)} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                <option>All stores</option>
                <option>Chatsworth</option>
                <option>Amanzimtoti</option>
                <option>Arbour Town</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={<Package />} label="Active orders" value={counts.active} />
          <Metric icon={<ClipboardCheck />} label="Ready to dispatch" value={counts.ready} />
          <Metric icon={<Truck />} label="Driver jobs" value={counts.drivers} />
          <Metric icon={<AlertTriangle />} label="Problems" value={counts.problems} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <h2 className="font-black">Dispatch queue</h2>
                <p className="text-xs text-slate-500">Move each order through the fulfilment chain.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{visible.length} orders</span>
            </div>

            <div className="divide-y divide-slate-100">
              {visible.map(order => (
                <button key={order.id} onClick={() => setSelected(order)} className="block w-full text-left hover:bg-slate-50">
                  <div className="grid gap-3 px-4 py-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                    <div>
                      <p className="font-black">{order.id}</p>
                      <p className="text-xs text-slate-500">{order.items} items · R{order.value.toFixed(2)}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[order.status]}`}>{order.status}</span>
                        <span className="text-xs text-slate-500">{order.store} → {order.suburb}</span>
                      </div>
                      {order.driver && <p className="mt-1 text-xs text-slate-500">Driver: {order.driver} · ETA: {order.eta}</p>}
                      {order.note && <p className="mt-1 text-xs font-semibold text-red-600">{order.note}</p>}
                    </div>
                    <ChevronRight className="hidden h-5 w-5 text-slate-300 sm:block" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-black">Today's flow</h2>
              <FlowRow icon={<ClipboardCheck />} label="Pick & pack" text="Store team" />
              <FlowRow icon={<Truck />} label="Dispatch" text="Assign driver" />
              <FlowRow icon={<MapPin />} label="Delivery" text="Track progress" />
              <FlowRow icon={<CheckCircle2 />} label="Proof of delivery" text="Close order" />
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-amber-800">Prototype principle</p>
              <p className="mt-2 text-sm leading-6 text-amber-950">Keep Take N Pay's existing ordering/payment systems. Zayzana controls the operational hand-off from order to delivery.</p>
            </div>
          </aside>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 p-4" onClick={() => setSelected(null)}>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order</p>
                <h2 className="text-2xl font-black">{selected.id}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <Detail icon={<UserRound />} label="Customer" value={selected.customer} />
              <Detail icon={<MapPin />} label="Route" value={`${selected.store} → ${selected.suburb}`} />
              <Detail icon={<Package />} label="Order" value={`${selected.items} items · R${selected.value.toFixed(2)}`} />
              <Detail icon={<Clock3 />} label="ETA" value={selected.eta} />
              {selected.driver && <Detail icon={<Truck />} label="Driver" value={selected.driver} />}
            </div>
            {nextStatus[selected.status] && (
              <button onClick={() => { advance(selected.id); setSelected(null); }} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
                Move to {nextStatus[selected.status]}
              </button>
            )}
            {selected.status === 'Problem' && (
              <button onClick={() => { setOrders(current => current.map(o => o.id === selected.id ? { ...o, status: 'Out for delivery', note: undefined } : o)); setSelected(null); }} className="mt-3 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white">
                Resolve problem
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-slate-400">{icon}<span className="text-xs font-bold">{label}</span></div><p className="mt-2 text-2xl font-black">{value}</p></div>;
}

function FlowRow({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return <div className="mt-4 flex items-center gap-3"><div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div><div><p className="text-sm font-bold">{label}</p><p className="text-xs text-slate-500">{text}</p></div></div>;
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="text-slate-400">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="font-semibold">{value}</p></div></div>;
}
