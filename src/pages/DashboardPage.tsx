import React from 'react';
import StatsCards from '../features/dashboard/components/StatsCards';
import BPTrendChart from '../features/charts/components/BPTrendChart';
import DiagnosisDonut from '../features/charts/components/DiagnosisDonut';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* SECTION 1: METRICS OVERVIEW */}
      <StatsCards />

      {/* SECTION 2: ADVANCED DATA VISUALIZERS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pb-12">
        <BPTrendChart />
        <DiagnosisDonut />
      </section>
    </div>
  );
}

