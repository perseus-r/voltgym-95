/**
 * Chart data sanitization utilities to prevent XSS in chart components
 */

interface ChartDataPoint {
  [key: string]: any;
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param input - String to sanitize
 * @returns Sanitized string safe for chart rendering
 */
export function sanitizeChartString(input: any): string {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitizes chart data array to prevent XSS
 * @param data - Array of chart data points
 * @returns Sanitized data array
 */
export function sanitizeChartData(data: ChartDataPoint[]): ChartDataPoint[] {
  return data.map(item => {
    const sanitized: ChartDataPoint = {};
    
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeChartString(value);
      } else if (typeof value === 'number') {
        // Ensure numbers are finite
        sanitized[key] = Number.isFinite(value) ? value : 0;
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  });
}

/**
 * Validates chart configuration to ensure safe rendering
 * @param config - Chart configuration object
 * @returns Validated and sanitized config
 */
export function validateChartConfig(config: any): any {
  if (!config || typeof config !== 'object') {
    return {};
  }
  
  // Remove potentially dangerous callback functions
  const sanitizedConfig = { ...config };
  
  // Remove functions that could execute arbitrary code
  const dangerousKeys = ['onClick', 'onHover', 'formatter', 'labelFormatter'];
  dangerousKeys.forEach(key => {
    if (typeof sanitizedConfig[key] === 'function') {
      delete sanitizedConfig[key];
    }
  });
  
  return sanitizedConfig;
}