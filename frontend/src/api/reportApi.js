import { apiRequest } from './client'

export function getDailySalesReport(date) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : ''
  return apiRequest(`/reports/daily-sales${qs}`)
}

export function getRevenueReport(startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  const qs = params.toString()
  return apiRequest(`/reports/revenue${qs ? `?${qs}` : ''}`)
}

export function getTopSellingItems(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.startDate) searchParams.append('startDate', params.startDate)
  if (params.endDate) searchParams.append('endDate', params.endDate)
  if (params.limit) searchParams.append('limit', params.limit)
  const qs = searchParams.toString()
  return apiRequest(`/reports/top-selling${qs ? `?${qs}` : ''}`)
}

export function getInventoryReport() {
  return apiRequest('/reports/inventory')
}

export function getTableUtilisationReport(startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  const qs = params.toString()
  return apiRequest(`/reports/table-utilisation${qs ? `?${qs}` : ''}`)
}

