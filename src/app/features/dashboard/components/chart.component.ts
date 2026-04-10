import { Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 transition-colors duration-200">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
      <div class="relative h-80">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() type: 'doughnut' | 'bar' | 'line' | 'pie' = 'doughnut';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  @Input() borderColor: string[] = [];

  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['labels']) {
      if (this.chart) {
        this.updateChart();
      }
    }
  }

  private createChart(): void {
    if (!this.canvasRef) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.backgroundColor.length > 0 
              ? this.backgroundColor 
              : this.getDefaultColors(),
            borderColor: this.borderColor.length > 0 
              ? this.borderColor 
              : '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: this.type === 'bar' ? ('top' as const) : ('bottom' as const),
            labels: {
              font: { size: 12 },
              padding: 15,
              usePointStyle: true
            }
          }
        },
        scales: this.type === 'bar' ? {
          y: {
            beginAtZero: true,
            ticks: { font: { size: 11 } }
          },
          x: {
            ticks: { font: { size: 11 } }
          }
        } : undefined
      }
    } as any;

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data.labels = this.labels;
    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].data = this.data;
    }
    this.chart.update();
  }

  private getDefaultColors(): string[] {
    const colors: string[] = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'
    ];
    const result: string[] = [];
    for (let i = 0; i < this.data.length; i++) {
      result.push(colors[i % colors.length]!);
    }
    return result;
  }
}
