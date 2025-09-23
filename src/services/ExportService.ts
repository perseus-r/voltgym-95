import { getStorage } from '@/lib/storage';

interface ExportData {
  workouts: any[];
  stats: any;
  achievements: any[];
  goals: any[];
  period: {
    start: Date;
    end: Date;
  };
}

export class ExportService {
  static generateWorkoutReport(startDate?: Date, endDate?: Date): ExportData {
    const workoutHistory = getStorage('bora_hist_v1', []);
    const achievements = getStorage('bora_achievements_v1', []);
    const goals = getStorage('bora_goals_v1', []);

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const end = endDate || new Date();

    // Filter workouts by date range
    const filteredWorkouts = workoutHistory.filter((workout: any) => {
      const workoutDate = new Date(workout.ts);
      return workoutDate >= start && workoutDate <= end;
    });

    // Calculate stats
    const stats = this.calculateStats(filteredWorkouts);

    return {
      workouts: filteredWorkouts,
      stats,
      achievements,
      goals,
      period: { start, end }
    };
  }

  static exportToCSV(data: ExportData): string {
    const headers = [
      'Data',
      'Foco',
      'Exercício',
      'Carga (kg)',
      'RPE',
      'Notas'
    ];

    const rows = data.workouts.flatMap((workout: any) =>
      workout.items?.map((item: any) => [
        new Date(workout.ts).toLocaleDateString('pt-BR'),
        workout.focus || 'Geral',
        item.name || '',
        item.carga || 0,
        item.rpe || 0,
        item.nota || ''
      ]) || []
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  static exportToJSON(data: ExportData): string {
    return JSON.stringify(data, null, 2);
  }

  static generatePDFReport(data: ExportData): string {
    // Generate HTML that can be converted to PDF
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Treinos - BORA App</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: #f8f9fa;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .period {
          margin: 10px 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .section {
          background: white;
          margin: 20px 0;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 {
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .workout-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .workout-table th,
        .workout-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .workout-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        .workout-table tr:hover {
          background: #f8f9fa;
        }
        .achievement {
          display: inline-block;
          background: #e8f5e8;
          color: #2d5a2d;
          padding: 8px 12px;
          margin: 5px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
        @media print {
          body { background: white; }
          .section { box-shadow: none; border: 1px solid #ddd; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏋️ Relatório de Treinos</h1>
        <div class="period">
          ${data.period.start.toLocaleDateString('pt-BR')} - ${data.period.end.toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.stats.totalWorkouts}</div>
          <div class="stat-label">Treinos Realizados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${(data.stats.totalVolume / 1000).toFixed(1)}t</div>
          <div class="stat-label">Volume Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.stats.avgRPE.toFixed(1)}</div>
          <div class="stat-label">RPE Médio</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.stats.consistency.toFixed(1)}</div>
          <div class="stat-label">Treinos/Semana</div>
        </div>
      </div>

      <div class="section">
        <h2>📊 Resumo por Exercício</h2>
        <table class="workout-table">
          <thead>
            <tr>
              <th>Exercício</th>
              <th>Frequência</th>
              <th>Carga Máxima</th>
              <th>RPE Médio</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(data.stats.exerciseStats || {}).map(([exercise, stats]: [string, any]) => `
              <tr>
                <td>${exercise}</td>
                <td>${stats.count}x</td>
                <td>${stats.maxWeight}kg</td>
                <td>${stats.avgRPE.toFixed(1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>🏆 Conquistas Desbloqueadas</h2>
        ${data.achievements
          .filter((a: any) => a.isUnlocked)
          .map((achievement: any) => `<span class="achievement">${achievement.title}</span>`)
          .join('')}
      </div>

      <div class="section">
        <h2>🎯 Metas Ativas</h2>
        ${data.goals
          .filter((g: any) => g.status === 'active')
          .map((goal: any) => `
            <div style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px;">
              <strong>${goal.title}</strong><br>
              Progresso: ${goal.currentValue}/${goal.targetValue} (${((goal.currentValue / goal.targetValue) * 100).toFixed(1)}%)
            </div>
          `).join('')}
      </div>

      <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>BORA App - Seu companheiro de treinos</p>
      </div>
    </body>
    </html>`;

    return html;
  }

  static downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async downloadPDF(data: ExportData): Promise<void> {
    const html = this.generatePDFReport(data);
    this.downloadFile(
      html, 
      `relatorio-treinos-${data.period.start.toISOString().split('T')[0]}.html`,
      'text/html'
    );
  }

  static downloadCSV(data: ExportData): void {
    const csv = this.exportToCSV(data);
    this.downloadFile(
      csv,
      `treinos-${data.period.start.toISOString().split('T')[0]}.csv`,
      'text/csv'
    );
  }

  static downloadJSON(data: ExportData): void {
    const json = this.exportToJSON(data);
    this.downloadFile(
      json,
      `backup-treinos-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  }

  private static calculateStats(workouts: any[]): any {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        avgRPE: 0,
        consistency: 0,
        exerciseStats: {}
      };
    }

    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum: number, workout: any) => {
      return sum + (workout.items?.reduce((s: number, item: any) => s + (item.carga || 0), 0) || 0);
    }, 0);

    let totalRPE = 0;
    let rpeCount = 0;
    const exerciseStats: Record<string, any> = {};

    workouts.forEach((workout: any) => {
      workout.items?.forEach((item: any) => {
        if (item.rpe) {
          totalRPE += item.rpe;
          rpeCount++;
        }

        if (item.name) {
          if (!exerciseStats[item.name]) {
            exerciseStats[item.name] = {
              count: 0,
              maxWeight: 0,
              totalRPE: 0,
              rpeCount: 0
            };
          }

          exerciseStats[item.name].count++;
          if (item.carga > exerciseStats[item.name].maxWeight) {
            exerciseStats[item.name].maxWeight = item.carga;
          }
          if (item.rpe) {
            exerciseStats[item.name].totalRPE += item.rpe;
            exerciseStats[item.name].rpeCount++;
          }
        }
      });
    });

    // Calculate average RPE for each exercise
    Object.keys(exerciseStats).forEach(exercise => {
      const stats = exerciseStats[exercise];
      stats.avgRPE = stats.rpeCount > 0 ? stats.totalRPE / stats.rpeCount : 0;
    });

    const avgRPE = rpeCount > 0 ? totalRPE / rpeCount : 0;
    
    // Calculate consistency (workouts per week)
    const firstWorkout = new Date(workouts[0].ts);
    const lastWorkout = new Date(workouts[workouts.length - 1].ts);
    const weeksDiff = Math.max(1, (lastWorkout.getTime() - firstWorkout.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const consistency = totalWorkouts / weeksDiff;

    return {
      totalWorkouts,
      totalVolume,
      avgRPE,
      consistency,
      exerciseStats
    };
  }
}