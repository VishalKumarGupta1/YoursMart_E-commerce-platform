import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { getAllOrderForAdmin } from "../../store/admin/order-slice";
import { fetchAllProducts } from "../../store/admin/product-slice";
import { getAllUser } from "../../store/admin/User-slice";

const DAY = 24 * 60 * 60 * 1000;

const STATUS_COLORS = {
  pending: "#c8b28a",
  confirmed: "#7c8570",
  shipped: "#4a6c85",
  delivered: "#2f4a3a",
  rejected: "#6b1f2a",
};

const STATUS_STYLES = {
  pending: "bg-[#f4ecd9] text-[#8a6a2f]",
  confirmed: "bg-[#e7ede5] text-[#3f5c39]",
  shipped: "bg-[#e5ebf0] text-[#35566e]",
  delivered: "bg-[#dfe9e2] text-[#2f4a3a]",
  rejected: "bg-[#f4e3e5] text-[#6b1f2a]",
};

const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const formatCompact = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${value}`;
};

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const inWindow = (value, days, offsetDays = 0) => {
  const date = toDate(value);
  if (!date) return false;
  const end = Date.now() - offsetDays * DAY;
  const start = end - days * DAY;
  return date.getTime() >= start && date.getTime() <= end;
};

const capitalize = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

const buildDelta = (current, previous) => {
  if (previous === 0) {
    return current === 0
      ? { value: 0, direction: "flat" }
      : { value: 100, direction: "up" };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change),
    direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
  };
};

const buildTimeSeries = (orders, days) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = [];
  const bucketMap = new Map();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = {
      key,
      label: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      revenue: 0,
      orders: 0,
    };
    buckets.push(bucket);
    bucketMap.set(key, bucket);
  }

  orders.forEach((order) => {
    const date = toDate(order.orderDate || order.createdAt);
    if (!date) return;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = bucketMap.get(key);
    if (!bucket) return;
    bucket.revenue += Number(order.totalAmount || 0);
    bucket.orders += 1;
  });

  return buckets;
};

const buildCategoryData = (orders, productMap) => {
  const map = new Map();

  orders.forEach((order) => {
    order.cartItems?.forEach((item) => {
      const product = productMap.get(String(item.productId));
      const name = product?.category || "Other";
      const quantity = Number(item.quantity || 0);
      const revenue =
        Number(item.price || product?.salePrice || 0) * quantity;
      const current = map.get(name) || { name, revenue: 0, quantity: 0 };
      current.revenue += revenue;
      current.quantity += quantity;
      map.set(name, current);
    });
  });

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
};

const buildTopProducts = (orders, productMap) => {
  const map = new Map();

  orders.forEach((order) => {
    order.cartItems?.forEach((item) => {
      const key = String(item.productId || item.title);
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 0);
      const revenue =
        Number(item.price || product?.salePrice || 0) * quantity;
      const current = map.get(key) || {
        key,
        title: item.title || product?.title || "Product",
        image: item.image || product?.image,
        revenue: 0,
        quantity: 0,
      };
      current.revenue += revenue;
      current.quantity += quantity;
      map.set(key, current);
    });
  });

  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
};

const buildCityData = (orders) => {
  const map = new Map();

  orders.forEach((order) => {
    const city = order.addressInfo?.city?.trim() || "Unknown";
    map.set(city, (map.get(city) || 0) + 1);
  });

  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
};

const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-white/95 px-3 py-2 shadow-[0_12px_30px_-14px_rgba(20,18,16,0.4)] backdrop-blur">
      {label ? (
        <p className="text-[9px] uppercase tracking-[0.2em] text-stone">
          {label}
        </p>
      ) : null}
      {payload.map((entry, index) => (
        <p
          key={`${entry.name}-${index}`}
          className="mt-1 flex items-center gap-2 text-xs text-ink"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: entry.color || entry.fill || "#b9985a" }}
          />
          <span className="text-stone">{entry.name}</span>
          <span className="ml-auto font-semibold">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

const DeltaPill = ({ delta }) => {
  if (!delta || delta.direction === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-stone">
        0.0%
      </span>
    );
  }

  const up = delta.direction === "up";
  const Icon = up ? TrendingUpIcon : TrendingDownIcon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
        up
          ? "bg-[#e7ede5] text-[#3f5c39]"
          : "bg-[#f4e3e5] text-[#6b1f2a]"
      }`}
    >
      <Icon sx={{ fontSize: 12 }} />
      {delta.value.toFixed(1)}%
    </span>
  );
};

const StatCard = ({ label, value, hint, delta, icon, loading }) => {
  const Icon = icon;

  return (
    <div className="group rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(20,18,16,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[9px] uppercase tracking-[0.24em] text-stone">
          {label}
        </p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory transition-colors duration-300 group-hover:bg-champagne/15">
          <Icon sx={{ fontSize: 17 }} className="text-champagne" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl leading-none text-ink">
        {loading ? "—" : value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {delta ? <DeltaPill delta={delta} /> : null}
        <p className="text-[10px] text-stone">{hint}</p>
      </div>
    </div>
  );
};

const Panel = ({ eyebrow, title, subtitle, action, children }) => (
  <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[9px] uppercase tracking-[0.3em] text-stone">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1.5 font-display text-xl text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-xs text-stone">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const Segmented = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-full border border-line p-0.5">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] transition-colors ${
          value === option.value
            ? "bg-ink text-ivory"
            : "text-stone hover:text-ink"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ChartEmpty = ({ loading, message }) => (
  <div className="flex h-[240px] flex-col items-center justify-center gap-3 text-center">
    {loading ? (
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-champagne" />
    ) : null}
    <p className="max-w-[220px] text-xs leading-relaxed text-stone">
      {loading ? "Loading insights…" : message}
    </p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
      STATUS_STYLES[status] || "bg-ivory text-stone"
    }`}
  >
    {status || "unknown"}
  </span>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading: orderLoading } = useSelector(
    (state) => state.adminOrder
  );
  const { productList, isLoading: productLoading } = useSelector(
    (state) => state.adminProduct
  );
  const { userList, isLoading: userLoading } = useSelector(
    (state) => state.adminUser
  );
  const { user } = useSelector((state) => state.auth);

  const [range, setRange] = useState(30);
  const [metric, setMetric] = useState("revenue");
  const [activeStatus, setActiveStatus] = useState(null);

  const loading = orderLoading || productLoading || userLoading;

  const loadData = useCallback(() => {
    dispatch(getAllOrderForAdmin());
    dispatch(fetchAllProducts());
    dispatch(getAllUser());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const orders = useMemo(() => orderList || [], [orderList]);
  const products = useMemo(() => productList || [], [productList]);
  const users = useMemo(() => userList || [], [userList]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [String(product._id), product])),
    [products]
  );
  const userMap = useMemo(
    () => new Map(users.map((item) => [String(item._id), item])),
    [users]
  );

  const salesOrders = useMemo(
    () => orders.filter((order) => order.orderStatus !== "rejected"),
    [orders]
  );

  const metrics = useMemo(() => {
    const revenue = salesOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
    const totalOrders = salesOrders.length;
    const averageOrder = totalOrders ? revenue / totalOrders : 0;
    const customers = users.filter((item) => item.role !== "Admin");
    const lowStock = products
      .filter((product) => Number(product.totalStock) <= 10)
      .sort((a, b) => Number(a.totalStock) - Number(b.totalStock));

    const revenueNow = salesOrders
      .filter((order) => inWindow(order.orderDate || order.createdAt, 30))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const revenueBefore = salesOrders
      .filter((order) => inWindow(order.orderDate || order.createdAt, 30, 30))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const ordersNow = salesOrders.filter((order) =>
      inWindow(order.orderDate || order.createdAt, 30)
    ).length;
    const ordersBefore = salesOrders.filter((order) =>
      inWindow(order.orderDate || order.createdAt, 30, 30)
    ).length;

    const customersNow = customers.filter((item) =>
      inWindow(item.createdAt, 30)
    ).length;
    const customersBefore = customers.filter((item) =>
      inWindow(item.createdAt, 30, 30)
    ).length;

    return {
      revenue,
      totalOrders,
      averageOrder,
      customers,
      lowStock,
      revenueDelta: buildDelta(revenueNow, revenueBefore),
      ordersDelta: buildDelta(ordersNow, ordersBefore),
      customersDelta: buildDelta(customersNow, customersBefore),
      categories: new Set(products.map((product) => product.category)).size,
    };
  }, [salesOrders, users, products]);

  const timeSeries = useMemo(
    () => buildTimeSeries(salesOrders, range),
    [salesOrders, range]
  );

  const statusData = useMemo(
    () =>
      Object.keys(STATUS_COLORS)
        .map((key) => ({
          key,
          name: capitalize(key),
          value: orders.filter((order) => order.orderStatus === key).length,
        }))
        .filter((entry) => entry.value > 0),
    [orders]
  );

  const statusTotal = statusData.reduce((sum, entry) => sum + entry.value, 0);

  const categoryData = useMemo(
    () => buildCategoryData(salesOrders, productMap),
    [salesOrders, productMap]
  );

  const topProducts = useMemo(
    () => buildTopProducts(salesOrders, productMap),
    [salesOrders, productMap]
  );

  const cityData = useMemo(() => buildCityData(orders), [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            (toDate(b.orderDate || b.createdAt)?.getTime() || 0) -
            (toDate(a.orderDate || a.createdAt)?.getTime() || 0)
        )
        .slice(0, 5),
    [orders]
  );

  const topRevenue = topProducts[0]?.revenue || 1;
  const isInitialLoading =
    loading && !orders.length && !products.length && !users.length;

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  const activeStatusEntry =
    activeStatus !== null ? statusData[activeStatus] : null;

  return (
    <div className="min-h-screen bg-paper px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-champagne" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-stone">
                Store intelligence
              </span>
            </div>
            <h1 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone">
              {greeting}, {user?.name?.split(" ")[0] || "Admin"}. Here is how
              YoursMart is performing today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-line bg-white px-4 py-2.5 text-[9px] uppercase tracking-[0.2em] text-stone">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshIcon
                sx={{ fontSize: 15 }}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Refreshing" : "Refresh data"}
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Gross revenue"
            value={formatINR(metrics.revenue)}
            hint="vs. previous 30 days"
            delta={metrics.revenueDelta}
            icon={PaymentsOutlinedIcon}
            loading={isInitialLoading}
          />
          <StatCard
            label="Total orders"
            value={metrics.totalOrders.toLocaleString("en-IN")}
            hint="vs. previous 30 days"
            delta={metrics.ordersDelta}
            icon={ShoppingBagOutlinedIcon}
            loading={isInitialLoading}
          />
          <StatCard
            label="Customers"
            value={metrics.customers.length.toLocaleString("en-IN")}
            hint="vs. previous 30 days"
            delta={metrics.customersDelta}
            icon={PeopleAltOutlinedIcon}
            loading={isInitialLoading}
          />
          <StatCard
            label="Average order"
            value={formatINR(metrics.averageOrder)}
            hint={`Across ${metrics.totalOrders} orders`}
            icon={ReceiptLongOutlinedIcon}
            loading={isInitialLoading}
          />
          <StatCard
            label="Products live"
            value={products.length.toLocaleString("en-IN")}
            hint={`${metrics.categories} categories`}
            icon={Inventory2OutlinedIcon}
            loading={isInitialLoading}
          />
          <StatCard
            label="Low stock"
            value={metrics.lowStock.length.toLocaleString("en-IN")}
            hint="At or below 10 units"
            icon={WarningAmberOutlinedIcon}
            loading={isInitialLoading}
          />
        </div>

        {/* Revenue + status */}
        <div className="grid gap-6 xl:grid-cols-3">
          <Panel
            eyebrow="Performance"
            title="Revenue & orders"
            subtitle="Track the shape of the business over time."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Segmented
                  value={range}
                  onChange={setRange}
                  options={[
                    { label: "7D", value: 7 },
                    { label: "30D", value: 30 },
                    { label: "90D", value: 90 },
                  ]}
                />
                <Segmented
                  value={metric}
                  onChange={setMetric}
                  options={[
                    { label: "Revenue", value: "revenue" },
                    { label: "Orders", value: "orders" },
                  ]}
                />
              </div>
            }
          >
            <div className="xl:col-span-2">
              {isInitialLoading ? (
                <ChartEmpty loading message="Loading performance data." />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={timeSeries}
                    margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="dashboardRevenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#b9985a"
                          stopOpacity={0.32}
                        />
                        <stop
                          offset="100%"
                          stopColor="#b9985a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 4"
                      stroke="#e9e2d6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#7a7469" }}
                      axisLine={false}
                      tickLine={false}
                      interval={range === 90 ? 6 : range === 30 ? 4 : 0}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#7a7469" }}
                      axisLine={false}
                      tickLine={false}
                      width={54}
                      tickFormatter={
                        metric === "revenue"
                          ? formatCompact
                          : (value) => value
                      }
                    />
                    <Tooltip
                      cursor={{ stroke: "#d9c49c", strokeWidth: 1 }}
                      content={
                        <ChartTooltip
                          formatter={
                            metric === "revenue"
                              ? formatINR
                              : (value) => `${value} orders`
                          }
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey={metric}
                      name={metric === "revenue" ? "Revenue" : "Orders"}
                      stroke="#b9985a"
                      strokeWidth={2}
                      fill="url(#dashboardRevenueFill)"
                      activeDot={{
                        r: 4,
                        fill: "#141210",
                        stroke: "#fbf8f3",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel
            eyebrow="Fulfilment"
            title="Order status"
            subtitle="Where every order stands right now."
          >
            {statusData.length ? (
              <>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Tooltip
                        content={
                          <ChartTooltip
                            formatter={(value) => `${value} orders`}
                          />
                        }
                      />
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={3}
                        stroke="none"
                        onMouseEnter={(_, index) => setActiveStatus(index)}
                        onMouseLeave={() => setActiveStatus(null)}
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={entry.key}
                            fill={STATUS_COLORS[entry.key]}
                            fillOpacity={
                              activeStatus === null || activeStatus === index
                                ? 1
                                : 0.35
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-3xl leading-none text-ink">
                      {activeStatusEntry
                        ? activeStatusEntry.value
                        : statusTotal}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-stone">
                      {activeStatusEntry ? activeStatusEntry.name : "Orders"}
                    </p>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  {statusData.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2 text-[10px] text-stone">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLORS[entry.key],
                          }}
                        />
                        {entry.name}
                      </span>
                      <span className="text-[10px] font-medium text-ink">
                        {statusTotal
                          ? `${Math.round(
                              (entry.value / statusTotal) * 100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <ChartEmpty
                loading={isInitialLoading}
                message="Orders will appear here as soon as customers check out."
              />
            )}
          </Panel>
        </div>

        {/* Category + city */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            eyebrow="Merchandise"
            title="Revenue by category"
            subtitle="Which departments are carrying the season."
            action={
              <Link
                to="/admin/products"
                className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ink"
              >
                Products
                <ArrowForwardIcon
                  sx={{ fontSize: 14 }}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            }
          >
            {categoryData.length ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(230, categoryData.length * 42)}
              >
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 4"
                    stroke="#e9e2d6"
                    horizontal={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={112}
                    tick={{ fontSize: 10, fill: "#7a7469" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f6f1e8" }}
                    content={<ChartTooltip formatter={formatINR} />}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === 0 ? "#141210" : "#b9985a"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty
                loading={isInitialLoading}
                message="Category revenue appears once orders start coming in."
              />
            )}
          </Panel>

          <Panel
            eyebrow="Geography"
            title="Orders by city"
            subtitle="Where your customers are checking out from."
          >
            {cityData.length ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(230, cityData.length * 42)}
              >
                <BarChart
                  data={cityData}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 4"
                    stroke="#e9e2d6"
                    horizontal={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={112}
                    tick={{ fontSize: 10, fill: "#7a7469" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f6f1e8" }}
                    content={
                      <ChartTooltip
                        formatter={(value) => `${value} orders`}
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    name="Orders"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                  >
                    {cityData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === 0 ? "#141210" : "#7c8570"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty
                loading={isInitialLoading}
                message="City insights appear after the first delivery address."
              />
            )}
          </Panel>
        </div>

        {/* Top products + low stock */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            eyebrow="Bestsellers"
            title="Top products"
            subtitle="Ranked by revenue across fulfilled orders."
          >
            {topProducts.length ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.key} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 font-display text-sm text-stone">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-11 w-11 shrink-0 border border-line object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-ivory text-xs text-stone">
                        {product.title?.charAt(0)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-xs font-medium text-ink">
                          {product.title}
                        </p>
                        <p className="shrink-0 text-xs font-semibold text-ink">
                          {formatINR(product.revenue)}
                        </p>
                      </div>
                      <div className="mt-1.5 h-1 w-full overflow-hidden bg-ivory">
                        <div
                          className="h-full bg-champagne"
                          style={{
                            width: `${Math.max(
                              6,
                              (product.revenue / topRevenue) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-stone">
                        {product.quantity} units sold
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ChartEmpty
                loading={isInitialLoading}
                message="Your bestsellers will be ranked here after the first order."
              />
            )}
          </Panel>

          <Panel
            eyebrow="Inventory"
            title="Low stock alerts"
            subtitle="Restock before these pieces sell through."
            action={
              <Link
                to="/admin/products"
                className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ink"
              >
                Manage
                <ArrowForwardIcon
                  sx={{ fontSize: 14 }}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            }
          >
            {metrics.lowStock.length ? (
              <div className="divide-y divide-line">
                {metrics.lowStock.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-11 w-11 shrink-0 border border-line object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-ivory text-xs text-stone">
                        {product.title?.charAt(0)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-ink">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-stone">
                        {product.category}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
                        Number(product.totalStock) === 0
                          ? "bg-[#f4e3e5] text-[#6b1f2a]"
                          : "bg-[#f4ecd9] text-[#8a6a2f]"
                      }`}
                    >
                      {Number(product.totalStock) === 0
                        ? "Out"
                        : `${product.totalStock} left`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[230px] flex-col items-center justify-center gap-2 text-center">
                <p className="font-display text-2xl text-ink">
                  Everything in stock.
                </p>
                <p className="max-w-[240px] text-xs leading-relaxed text-stone">
                  No product is below the ten-unit threshold right now.
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* Recent orders */}
        <Panel
          eyebrow="Latest activity"
          title="Recent orders"
          subtitle="The five most recent checkouts."
          action={
            <Link
              to="/admin/orders"
              className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ink"
            >
              View all
              <ArrowForwardIcon
                sx={{ fontSize: 14 }}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          }
        >
          {recentOrders.length ? (
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-line text-left">
                    {[
                      "Order",
                      "Customer",
                      "Date",
                      "Items",
                      "Amount",
                      "Status",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-2 pb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-stone"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const customer = userMap.get(String(order.userId));
                    return (
                      <tr
                        key={order._id}
                        className="border-b border-line/70 text-xs text-ink transition-colors last:border-0 hover:bg-ivory/60"
                      >
                        <td className="px-2 py-3.5 font-mono text-[11px] text-stone">
                          #{order._id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-2 py-3.5">
                          {customer?.name || "Guest customer"}
                        </td>
                        <td className="px-2 py-3.5 text-stone">
                          {toDate(order.orderDate || order.createdAt)
                            ? toDate(
                                order.orderDate || order.createdAt
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-2 py-3.5 text-stone">
                          {order.cartItems?.length || 0}
                        </td>
                        <td className="px-2 py-3.5 font-semibold">
                          {formatINR(order.totalAmount)}
                        </td>
                        <td className="px-2 py-3.5">
                          <StatusBadge status={order.orderStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ChartEmpty
              loading={isInitialLoading}
              message="Recent orders will appear here as soon as the store opens."
            />
          )}
        </Panel>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              to: "/admin/orders",
              label: "Orders",
              copy: "Review, fulfil and update status.",
              icon: ShoppingCartOutlinedIcon,
              meta: `${orders.length} total`,
            },
            {
              to: "/admin/products",
              label: "Products",
              copy: "Manage pricing, stock and imagery.",
              icon: InventoryOutlinedIcon,
              meta: `${products.length} live`,
            },
            {
              to: "/admin/users",
              label: "Customers",
              copy: "See every registered account.",
              icon: PeopleOutlineIcon,
              meta: `${users.length} accounts`,
            },
            {
              to: "/admin/features",
              label: "Features",
              copy: "Curate the storefront experience.",
              icon: StorefrontOutlinedIcon,
              meta: "Storefront",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-28px_rgba(20,18,16,0.45)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-champagne transition-colors group-hover:bg-ink group-hover:text-champagne-light">
                  <Icon sx={{ fontSize: 18 }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg text-ink">
                      {item.label}
                    </span>
                    <ArrowForwardIcon
                      sx={{ fontSize: 15 }}
                      className="text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-stone">
                    {item.copy}
                  </span>
                  <span className="mt-2 block text-[9px] uppercase tracking-[0.18em] text-champagne">
                    {item.meta}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
