import { useEffect, useMemo, useState } from 'react'
import {
  getDailySalesReport,
  getInventoryReport,
  getRevenueReport,
  getTableUtilisationReport,
  getTopSellingItems,
} from '../api/reportApi'
import { useToast } from '../hooks/useToast'

export function ReportDashboard() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'revenue' | 'items' | 'tables' | 'inventory'
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().slice(0, 10)
  })
  const [rangeEnd, setRangeEnd] = useState(() => new Date().toISOString().slice(0, 10))

  // Data states
  const [dailySales, setDailySales] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [topItems, setTopItems] = useState([])
  const [tableUsage, setTableUsage] = useState([])
  const [inventoryReport, setInventoryReport] = useState(null)

  const loadAllReports = async () => {
    try {
      setLoading(true)
      const [dailyRes, revRes, topRes, tableRes, invRes] = await Promise.all([
        getDailySalesReport(selectedDate),
        getRevenueReport(rangeStart, rangeEnd),
        getTopSellingItems({ startDate: rangeStart, endDate: rangeEnd, limit: 10 }),
        getTableUtilisationReport(rangeStart, rangeEnd),
        getInventoryReport(),
      ])

      setDailySales(dailyRes?.data || null)
      setRevenueData(revRes?.data || null)
      setTopItems(topRes?.data || [])
      setTableUsage(tableRes?.data || [])
      setInventoryReport(invRes?.data || null)
    } catch (err) {
      toast.error(err.message || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllReports()
  }, [selectedDate, rangeStart, rangeEnd])

  // Overview quick stats
  const maxRevenueDay = useMemo(() => {
    if (!revenueData?.daily?.length) return 0
    return Math.max(...revenueData.daily.map((d) => d.revenue || 0), 1)
  }, [revenueData])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-10 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
            📊 Reports & Analytics
          </h1>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 sm:text-sm">
            Real-time sales performance, revenue analytics, top dishes, and table utilisation.
          </p>
        </div>

        {/* Date controls — Responsive mobile-friendly flex */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex w-full items-center justify-between gap-1.5 rounded-xl border border-stone-200 bg-white p-1.5 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:w-auto sm:px-3 sm:py-1.5">
            <span className="hidden text-xs font-semibold text-stone-500 sm:inline">Range:</span>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="w-[125px] min-w-0 rounded-lg bg-stone-50 px-2 py-1 text-xs font-medium text-stone-800 outline-hidden dark:bg-stone-800 dark:text-stone-200 sm:w-auto sm:bg-transparent sm:p-0"
              aria-label="Start date"
            />
            <span className="text-xs font-bold text-stone-400">→</span>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="w-[125px] min-w-0 rounded-lg bg-stone-50 px-2 py-1 text-xs font-medium text-stone-800 outline-hidden dark:bg-stone-800 dark:text-stone-200 sm:w-auto sm:bg-transparent sm:p-0"
              aria-label="End date"
            />
          </div>
          <button
            onClick={loadAllReports}
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-amber-600 active:scale-95 sm:h-auto"
          >
            <span>🔄</span> Refresh
          </button>
        </div>
      </div>

      {/* Tab Nav (Mobile Horizontal Scrollable) */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: 'overview', label: '📈 Overview' },
          { id: 'revenue', label: '💵 Revenue Trends' },
          { id: 'items', label: '🏆 Top Dishes' },
          { id: 'tables', label: '🍽️ Table Utilisation' },
          { id: 'inventory', label: '📦 Stock Status' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Daily Sales Flash Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <span className="text-xl">💰</span>
                  <p className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
                    ${(dailySales?.totalRevenue || 0).toFixed(2)}
                  </p>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Daily Sales ({selectedDate})
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <span className="text-xl">🧾</span>
                  <p className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
                    {dailySales?.totalOrders || 0}
                  </p>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Orders Today
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <span className="text-xl">📊</span>
                  <p className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
                    ${(dailySales?.averageOrderValue || 0).toFixed(2)}
                  </p>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Avg Order Value
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <span className="text-xl">🏦</span>
                  <p className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
                    ${(revenueData?.totals?.revenue || 0).toFixed(2)}
                  </p>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Selected Range Total
                  </p>
                </div>
              </div>

              {/* 2-column layout: Mini Revenue Bars + Top Items Preview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Revenue Breakdown in Range */}
                <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    💵 Daily Revenue Breakdown
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {rangeStart} to {rangeEnd}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {revenueData?.daily?.length ? (
                      revenueData.daily.map((day) => {
                        const pct = Math.min(Math.round((day.revenue / maxRevenueDay) * 100), 100)
                        return (
                          <div key={day._id} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-stone-700 dark:text-stone-300">{day._id}</span>
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                ${day.revenue.toFixed(2)}{' '}
                                <span className="font-normal text-stone-400">({day.orders} orders)</span>
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                              <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="py-8 text-center text-xs text-stone-400">No settled orders found in this period.</p>
                    )}
                  </div>
                </div>

                {/* Top 5 Dishes */}
                <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    🏆 Top Popular Items
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Highest quantity sold</p>

                  <div className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
                    {topItems.length ? (
                      topItems.slice(0, 5).map((item, idx) => (
                        <div key={item._id || idx} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                {item.name || 'Dish'}
                              </p>
                              <p className="text-[10px] text-stone-400">{item.quantity} sold</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                            ${(item.revenue || 0).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-xs text-stone-400">No sales items data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVENUE */}
          {activeTab === 'revenue' && (
            <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    📈 Revenue Overview
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Detailed chronological breakdown for settled orders
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  Total Orders: {revenueData?.totals?.orders || 0} | Revenue: ${(revenueData?.totals?.revenue || 0).toFixed(2)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <tr>
                      <th className="py-2.5 font-semibold">Date</th>
                      <th className="py-2.5 font-semibold">Orders Completed</th>
                      <th className="py-2.5 font-semibold">Revenue Earned</th>
                      <th className="py-2.5 font-semibold">Avg / Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {revenueData?.daily?.length ? (
                      revenueData.daily.map((day) => {
                        const avg = day.orders > 0 ? (day.revenue / day.orders).toFixed(2) : '0.00'
                        return (
                          <tr key={day._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                            <td className="py-3 font-semibold text-stone-800 dark:text-stone-200">{day._id}</td>
                            <td className="py-3 text-stone-600 dark:text-stone-400">{day.orders}</td>
                            <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                              ${day.revenue.toFixed(2)}
                            </td>
                            <td className="py-3 font-mono text-stone-600 dark:text-stone-400">${avg}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-stone-400">
                          No revenue records found for this range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TOP DISHES */}
          {activeTab === 'items' && (
            <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                🏆 Top-Selling Menu Items
              </h3>
              <p className="mb-4 text-xs text-stone-500 dark:text-stone-400">
                Ranked by volume ordered during the selected date range
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <tr>
                      <th className="py-2.5 font-semibold">Rank</th>
                      <th className="py-2.5 font-semibold">Dish Name</th>
                      <th className="py-2.5 font-semibold">Units Sold</th>
                      <th className="py-2.5 font-semibold">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {topItems.length ? (
                      topItems.map((item, idx) => (
                        <tr key={item._id || idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                          <td className="py-3 font-bold text-amber-600">#{idx + 1}</td>
                          <td className="py-3 font-medium text-stone-900 dark:text-stone-100">
                            {item.name || 'Unnamed Dish'}
                          </td>
                          <td className="py-3 font-semibold text-stone-800 dark:text-stone-200">
                            {item.quantity} orders
                          </td>
                          <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${(item.revenue || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-stone-400">
                          No dish sales data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TABLE UTILISATION */}
          {activeTab === 'tables' && (
            <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                🍽️ Table Utilisation & Turnover
              </h3>
              <p className="mb-4 text-xs text-stone-500 dark:text-stone-400">
                See which restaurant tables generate the most visits and revenue
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {tableUsage.length ? (
                  tableUsage.map((t) => (
                    <div
                      key={t.tableId || t.tableNumber}
                      className="rounded-2xl border border-stone-100 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-800/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                          Table #{t.tableNumber ?? 'N/A'}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          {t.orders} Orders
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-bold text-amber-600 dark:text-amber-400">
                        ${(t.revenue || 0).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-stone-400">Total volume generated</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full py-8 text-center text-xs text-stone-400">
                    No table usage recorded in this time range.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: INVENTORY REPORT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Low stock alert box */}
              {inventoryReport?.lowStock?.length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
                    <span className="text-base">⚠️</span>
                    <h4 className="font-semibold text-xs sm:text-sm">
                      {inventoryReport.lowStock.length} Items Below Minimum Threshold
                    </h4>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {inventoryReport.lowStock.map((item) => (
                      <span
                        key={item._id}
                        className="rounded-lg bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                      >
                        {item.name}: {item.quantity} {item.unit} (Alert at {item.lowStockThreshold})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  📦 Complete Inventory Levels
                </h3>
                <p className="mb-4 text-xs text-stone-500 dark:text-stone-400">
                  Real-time stock quantities across all ingredients
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                      <tr>
                        <th className="py-2 font-semibold">Ingredient</th>
                        <th className="py-2 font-semibold">Category</th>
                        <th className="py-2 font-semibold">Current Quantity</th>
                        <th className="py-2 font-semibold">Threshold</th>
                        <th className="py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {inventoryReport?.items?.map((item) => {
                        const isLow = item.quantity <= item.lowStockThreshold
                        return (
                          <tr key={item._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                            <td className="py-2.5 font-medium text-stone-900 dark:text-stone-100">
                              {item.name}
                            </td>
                            <td className="py-2.5 text-stone-500">{item.category}</td>
                            <td className="py-2.5 font-mono font-semibold text-stone-800 dark:text-stone-200">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-2.5 text-stone-400">
                              {item.lowStockThreshold} {item.unit}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  isLow
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                }`}
                              >
                                {isLow ? 'Low Stock' : 'Adequate'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

