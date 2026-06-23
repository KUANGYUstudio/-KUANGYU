import { useState, useMemo } from "react";
import { getProductImage, getProductUrl } from "@/lib/productImages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ShoppingBag, User, CreditCard, ChevronDown, ChevronUp, Plus, Minus, CheckCircle2, ShoppingCart, X, Filter, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

// ─── 系列特性描述 ───────────────────────────────────────────
const SERIES_DESCRIPTIONS: Record<string, string> = {
  "HIDDEN COMFORT 雲朵舒適系列": "柔軟舒適，全天候乾爽",
  "ULTRA LIGHT 超輕快系列": "超輕薄設計，速度首選",
  "SILVER 抗菌銀離子系列": "銀離子抗菌，防臭防滑",
  "ULTRAGLIDE 蹠骨緩衝系列": "蹠骨緩衝，長距離專用",
  "ENDURO 全能耐磨系列": "中等厚度，全能耐磨",
  "BLISTER RESIST LIGHT 馬海毛抗水泡輕量系列": "馬海毛抗水泡，輕量透氣",
  "HIDDEN DRY 極薄親膚系列": "極薄透氣，輕盈無感",
};

const PRODUCTS = [
  {
    series: "HIDDEN COMFORT 雲朵舒適系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8025-0200", color: "白", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8025-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8025-0339", color: "炭灰", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8025-0501", color: "紫丁香", sizes: ["S","M"], price: 450 },
      { code: "8025-0128", color: "檸檬黃", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8025-8828", color: "螢光粉", sizes: ["S","M"], price: 450 },
      { code: "8025-7137", color: "田徑風", sizes: ["S","M","L"], price: 450 },
    ],
  },
  {
    series: "ULTRA LIGHT 超輕快系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8926-3300", color: "黑", sizes: ["S","M","L"], price: 450 },
      { code: "8926-0331", color: "灰白", sizes: ["S","M","L"], price: 450 },
      { code: "8926-6670", color: "耀光藍", sizes: ["S","M","L"], price: 450 },
      { code: "8926-8864", color: "西瓜紅", sizes: ["S","M"], price: 450 },
      { code: "8926-5578", color: "紫丁香", sizes: ["S","M","L"], price: 450 },
      { code: "8926-0606", color: "亮藍", sizes: ["S","M","L"], price: 450 },
    ],
  },
  {
    series: "ULTRA LIGHT 超輕快系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8927-3300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8927-2200", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "SILVER 抗菌銀離子系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8073-0339", color: "白灰", sizes: ["S","M","L"], price: 450 },
      { code: "8073-0689", color: "灰藍", sizes: ["S","M"], price: 450 },
      { code: "8073-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8073-6366", color: "鈷藍", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8073-0338", color: "白", sizes: ["S","M","L","XL"], price: 450 },
    ],
  },
  {
    series: "SILVER 抗菌銀離子系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8074-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8074-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "ULTRAGLIDE 蹠骨緩衝系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8028-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8028-0338", color: "白", sizes: ["S","M","L","XL"], price: 450 },
    ],
  },
  {
    series: "ULTRAGLIDE 蹠骨緩衝系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8029-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8029-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "ENDURO 全能耐磨系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8031-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8031-0338", color: "白", sizes: ["S","M","L","XL"], price: 450 },
    ],
  },
  {
    series: "ENDURO 全能耐磨系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8032-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8032-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "ENDURO 全能耐磨系列",
    type: "CREW 長筒襪",
    items: [
      { code: "8033-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8033-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "BLISTER RESIST LIGHT 馬海毛抗水泡輕量系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8038-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8038-0338", color: "白", sizes: ["S","M","L","XL"], price: 450 },
    ],
  },
  {
    series: "BLISTER RESIST LIGHT 馬海毛抗水泡輕量系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8039-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8039-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
  {
    series: "HIDDEN DRY 極薄親膚系列",
    type: "NO SHOW 隱形襪",
    items: [
      { code: "8040-0300", color: "黑", sizes: ["S","M","L","XL"], price: 450 },
      { code: "8040-0338", color: "白", sizes: ["S","M","L","XL"], price: 450 },
    ],
  },
  {
    series: "HIDDEN DRY 極薄親膚系列",
    type: "MINI CREW 中筒襪",
    items: [
      { code: "8041-0300", color: "黑", sizes: ["S","M","L","XL"], price: 550 },
      { code: "8041-0338", color: "白", sizes: ["S","M","L","XL"], price: 550 },
    ],
  },
];

// ─── 判斷是否為短筒 ───────────────────────────────────────────
const isShortSock = (type: string): boolean => {
  return type.includes("NO SHOW") || type.includes("短襪");
};

// ─── 表單 Schema ───────────────────────────────────────────────
const orderFormSchema = z.object({
  name: z.string().min(1, "請輸入訂購人姓名"),
  phone: z.string().min(1, "請輸入聯絡電話"),
  email: z.string().email("請輸入有效的 Email"),
  paymentMethod: z.enum(["bank_transfer", "cash", "line_pay"]),
  accountLast5: z.string().optional(),
  note: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

// ─── 主元件 ───────────────────────────────────────────────────
export default function Home() {
  const [cart, setCart] = useState<Record<string, Record<string, number>>>({});
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "short" | "long">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [showCart, setShowCart] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  });

  const paymentMethod = watch("paymentMethod");

  // ─── 計算購物車 ───────────────────────────────────────────
  const cartSummary = useMemo(() => {
    let totalAmount = 0;
    let totalItems = 0;
    const items: any[] = [];

    Object.entries(cart).forEach(([code, sizes]) => {
      Object.entries(sizes).forEach(([size, qty]) => {
        if (qty > 0) {
          const product = PRODUCTS.flatMap(g => g.items).find(p => p.code === code);
          if (product) {
            const subtotal = product.price * qty;
            totalAmount += subtotal;
            totalItems += qty;
            items.push({
              code,
              color: product.color,
              size,
              qty,
              price: product.price,
              series: PRODUCTS.find(g => g.items.some(p => p.code === code))?.series,
              type: PRODUCTS.find(g => g.items.some(p => p.code === code))?.type,
            });
          }
        }
      });
    });

    return { totalAmount, totalItems, items };
  }, [cart]);

  // ─── 篩選品項 ───────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return PRODUCTS.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (filter === "short") return isShortSock(group.type);
        if (filter === "long") return !isShortSock(group.type);
        return true;
      }),
    })).filter(group => group.items.length > 0);
  }, [filter]);

  // ─── 提交訂單 ───────────────────────────────────────────
  const onSubmit = async (data: OrderFormData) => {
    if (cartSummary.totalItems === 0) {
      toast.error("請至少選擇一件商品");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        paymentMethod: data.paymentMethod,
        accountLast5: data.accountLast5 || "",
        note: data.note || "",
        items: cartSummary.items,
        totalAmount: cartSummary.totalAmount,
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwYECr4mgOQC4gGq0VwJFDVX46VTNjT5rdkfe5Wwm3E0sU9GAxu2ADLiKpVh3k9TK5FPA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload ),
        }
      );

      setSuccessOrder({
        orderNumber: `ORD-${new Date().toISOString().split('T')[0]}-${Math.random().toString().slice(2, 7)}`,
        ...payload,
      });

      setCart({});
      reset();
      toast.success("訂單已送出！");
    } catch (error) {
      toast.error("訂單送出失敗，請重試");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── 成功頁面 ───────────────────────────────────────────
  if (successOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">訂單已成功送出！</h1>
            <p className="text-lg text-gray-600">感謝您的訂購</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">訂單編號</p>
                <p className="text-lg font-bold text-orange-600">{successOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">訂購人</p>
                <p className="text-lg font-bold text-gray-900">{successOrder.name}</p>
              </div>
            </div>
            <div className="border-t border-orange-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">訂單金額</p>
              <p className="text-3xl font-bold text-orange-600">NT$ {successOrder.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">訂單明細</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {successOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <span>{item.color} {item.size} × {item.qty}</span>
                  <span className="font-semibold">NT$ {(item.qty * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              ✓ 確認信已發送至 <span className="font-bold">{successOrder.email}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              setSuccessOrder(null);
              window.scrollTo(0, 0);
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            返回表單
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 頁首 ─────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold">光聿團購</h1>
              <p className="text-orange-100 text-lg">Balega Running Socks</p>
            </div>
            <ShoppingBag className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── 主表單 ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* ─── 篩選按鈕 ─────────────────────────────────── */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Filter className="w-4 h-4" />
                全部
              </button>
              <button
                onClick={() => setFilter("short")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "short"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                短筒
              </button>
              <button
                onClick={() => setFilter("long")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "long"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                中長筒
              </button>
            </div>

            {/* ─── 品項列表 ─────────────────────────────────── */}
            <div className="space-y-6 mb-8">
              {filteredProducts.map((group, groupIdx) => (
                <div key={groupIdx} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* ─── 系列標題 ─────────────────────────── */}
                  <button
                    onClick={() => setExpandedSeries(prev => ({
                      ...prev,
                      [groupIdx]: !prev[groupIdx]
                    }))}
                    className="w-full bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 flex items-center justify-between hover:from-orange-100 hover:to-orange-200 transition"
                  >
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-lg">{group.series}</h3>
                      <p className="text-sm text-orange-600 font-semibold">{SERIES_DESCRIPTIONS[group.series]}</p>
                    </div>
                    {expandedSeries[groupIdx] ? (
                      <ChevronUp className="w-5 h-5 text-orange-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-orange-600" />
                    )}
                  </button>

                  {/* ─── 品項卡片 ─────────────────────────── */}
                  {expandedSeries[groupIdx] && (
                    <div className="p-6 bg-white">
                      <h4 className="font-semibold text-gray-900 mb-4">{group.type}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.items.map((item) => (
                          <div key={item.code} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                            {/* ─── 圖片 ─────────────────────────── */}
                            <div className="flex items-center justify-center mb-3 relative group">
                              <img
                                src={getProductImage(item.code)}
                                alt={item.color}
                                className="w-32 h-32 object-cover rounded cursor-pointer group-hover:opacity-80 transition"
                                onClick={() => {
                                  const url = getProductUrl(item.code);
                                  if (url) window.open(url, "_blank");
                                }}
                              />
                              <ExternalLink className="absolute w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition" />
                            </div>

                            {/* ─── 商品資訊 ─────────────────────── */}
                            <p className="text-sm text-gray-600 mb-1">編號: {item.code}</p>
                            <p className="font-semibold text-gray-900 mb-2">{item.color}</p>
                            <p className="text-lg font-bold text-orange-600 mb-4">NT$ {item.price}</p>

                            {/* ─── 尺寸和數量 ─────────────────────── */}
                            <div className="space-y-2">
                              {item.sizes.map((size) => {
                                const qty = cart[item.code]?.[size] || 0;
                                return (
                                  <div key={size} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span className="text-sm font-semibold text-gray-700 w-8">{size}</span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => {
                                          setCart(prev => ({
                                            ...prev,
                                            [item.code]: {
                                              ...prev[item.code],
                                              [size]: Math.max(0, (prev[item.code]?.[size] || 0) - 1)
                                            }
                                          }));
                                        }}
                                        className="p-1 hover:bg-orange-100 rounded transition"
                                      >
                                        <Minus className="w-4 h-4 text-orange-600" />
                                      </button>
                                      <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
                                      <button
                                        onClick={() => {
                                          setCart(prev => ({
                                            ...prev,
                                            [item.code]: {
                                              ...prev[item.code],
                                              [size]: (prev[item.code]?.[size] || 0) + 1
                                            }
                                          }));
                                        }}
                                        className="p-1 hover:bg-orange-100 rounded transition"
                                      >
                                        <Plus className="w-4 h-4 text-orange-600" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ─── 訂購人資訊 ─────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600" />
                  訂購人資訊
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-semibold">
                      姓名 *
                    </Label>
                    <Input
                      id="name"
                      placeholder="請輸入姓名"
                      {...register("name")}
                      className="mt-1 border-gray-300"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-semibold">
                      聯絡電話 *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="請輸入聯絡電話"
                      {...register("phone")}
                      className="mt-1 border-gray-300"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="請輸入 Email"
                      {...register("email")}
                      className="mt-1 border-gray-300"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* ─── 付款方式 ─────────────────────────────── */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  付款方式 *
                </h3>

                <RadioGroup value={paymentMethod} onValueChange={(value) => {
                  // 手動更新表單值
                  const event = { target: { value } } as any;
                  register("paymentMethod").onChange(event);
                }}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer font-semibold text-gray-900">
                        銀行轉帳
                      </Label>
                    </div>

                    {paymentMethod === "bank_transfer" && (
                      <div className="ml-8 bg-white border-l-4 border-orange-600 p-4 rounded">
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">銀行：</span>國泰世華（013）
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">帳戶名稱：</span>費聿凡
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          <span className="font-semibold">匯款帳號：</span>269506136805
                        </p>
                        <Label htmlFor="accountLast5" className="text-gray-700 font-semibold text-sm">
                          帳號後五碼
                        </Label>
                        <Input
                          id="accountLast5"
                          placeholder="請輸入您的帳號後五碼"
                          {...register("accountLast5")}
                          className="mt-1 border-gray-300 text-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer font-semibold text-gray-900">
                        現金
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer">
                      <RadioGroupItem value="line_pay" id="line_pay" />
                      <Label htmlFor="line_pay" className="flex-1 cursor-pointer font-semibold text-gray-900">
                        LINE Pay
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod.message}</p>}
              </div>

              {/* ─── 備註 ─────────────────────────────────── */}
              <div className="bg-gray-50 rounded-lg p-6">
                <Label htmlFor="note" className="text-gray-700 font-semibold">
                  備註（選填）
                </Label>
                <textarea
                  id="note"
                  placeholder="如有特殊要求，請在此說明"
                  {...register("note")}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  rows={3}
                />
              </div>

              {/* ─── 送出按鈕 ─────────────────────────────── */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg text-lg transition disabled:opacity-50"
              >
                {isSubmitting ? "處理中..." : "送出訂單"}
              </Button>
            </form>
          </div>

          {/* ─── 購物車摘要（側邊欄） ─────────────────────── */}
          <div className="lg:col-span-1">
            {showCart ? (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 sticky top-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    購物車
                  </h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-1 hover:bg-orange-200 rounded transition"
                  >
                    <X className="w-4 h-4 text-orange-600" />
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-orange-600">
                    NT$ {cartSummary.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cartSummary.totalItems} 件商品
                  </p>
                </div>

                {cartSummary.items.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {cartSummary.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-white p-2 rounded">
                        <p className="font-semibold">{item.color} {item.size}</p>
                        <p className="text-gray-600">× {item.qty} = NT$ {(item.qty * item.price).toLocaleString()}</p>
                      </div>
                    ))}
                    {cartSummary.items.length > 3 && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        ... 還有 {cartSummary.items.length - 3} 項
                      </p>
                    )}
                  </div>
                )}

                {cartSummary.totalItems === 0 && (
                  <p className="text-center text-gray-600 py-8">購物車是空的</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowCart(true)}
                className="fixed bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartSummary.totalItems}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
