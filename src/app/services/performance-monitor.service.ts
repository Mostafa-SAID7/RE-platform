import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metrics: { [key: string]: number } = {};

  /**
   * Start measuring performance for a specific operation
   */
  startMeasure(label: string): void {
    if (performance.mark) {
      performance.mark(`${label}-start`);
    }
  }

  /**
   * End measuring performance and log the duration
   */
  endMeasure(label: string): number {
    if (performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0] as PerformanceMeasure;
        const duration = measure.duration;
        this.metrics[label] = duration;
        console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        return duration;
      } catch (e) {
        console.error(`Failed to measure ${label}:`, e);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): { [key: string]: number } {
    return { ...this.metrics };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = {};
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals(): Promise<any> {
    return new Promise((resolve) => {
      const vitals: any = {};

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            vitals.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Input Delay (FID) / Interaction to Next Paint (INP)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.fid = (entries[0] as any).processingDuration;
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          setTimeout(() => {
            resolve(vitals);
          }, 5000);
        } catch (e) {
          console.error('Failed to collect Core Web Vitals:', e);
          resolve(vitals);
        }
      } else {
        resolve(vitals);
      }
    });
  }

  /**
   * Measure page load time
   */
  getPageLoadTime(): number {
    if (performance.timing) {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
    return 0;
  }

  /**
   * Measure Time to First Byte (TTFB)
   */
  getTTFB(): number {
    if (performance.timing) {
      return performance.timing.responseStart - performance.timing.navigationStart;
    }
    return 0;
  }

  /**
   * Measure DOM Content Loaded time
   */
  getDOMContentLoadedTime(): number {
    if (performance.timing) {
      return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    }
    return 0;
  }
}
