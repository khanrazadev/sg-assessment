import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Filter, Info, Server, Key, Users, AlertTriangle, UserX, ChevronDown } from 'lucide-react';
import { DonutChart } from '@/components/charts/donut-chart';
import { LineChart } from '@/components/charts/line-chart';
import { StackedBarChart } from '@/components/charts/stacked-bar-chart';
import { riskScoreData, secretsSeverityData } from '@/data/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6 pb-12 w-full max-w-[1400px] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div className="min-w-0">
          <h1 className="text-[20px] md:text-[22px] font-semibold text-gray-900 tracking-tight truncate">Security overview</h1>
          <p className="text-[12px] md:text-[13px] text-gray-500 mt-1">Last scan completed 15 mins ago &middot; Monitoring 7,760 NHIs</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hidden sm:flex shrink-0">
            <RefreshCw className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </Button>
          <Button variant="outline" className="text-gray-700 text-[12px] md:text-[13px] font-medium h-8 md:h-9 px-3 md:px-4 border-gray-200 shrink-0">
            <Download className="h-4 w-4" /><span className="hidden sm:inline ml-2">Export data</span>
          </Button>
          <Button variant="outline" className="text-gray-700 text-[12px] md:text-[13px] font-medium h-8 md:h-9 px-3 md:px-4 border-gray-200 shrink-0">
            <Filter className="h-4 w-4" /><span className="hidden sm:inline ml-2">Filter</span>
          </Button>
        </div>
      </div>

      {/* Top Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Spans 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Top Row: Donut Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-0 pt-5 px-6">
                <div className="flex flex-row items-center justify-between w-full">
                  <CardTitle className="text-[15px] font-semibold text-gray-900">Overall risk score</CardTitle>
                  <Info className="h-[18px] w-[18px] text-gray-300" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-8 pb-4">
                <div className="relative w-[200px] h-[100px] mb-2 flex items-end justify-center">
                  <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                    {/* Background Arc */}
                    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
                    {/* Value Arc (80% fill) */}
                    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#ff4d4f" strokeWidth="6" strokeLinecap="round" strokeDasharray="113 141.3" />
                  </svg>
                  <div className="flex flex-col items-center translate-y-3">
                    <span className="text-[32px] font-semibold text-gray-900 leading-none">80%</span>
                    <span className="text-[13px] text-gray-500 mt-1.5 font-medium">Medium Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-0 pt-5 px-6">
                <div className="flex flex-row items-center justify-between w-full">
                  <CardTitle className="text-[15px] font-semibold text-gray-900">Secrets by severity</CardTitle>
                  <Info className="h-[18px] w-[18px] text-gray-300" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-8 pb-4">
                <div className="relative w-[200px] h-[100px] mb-2 flex items-end justify-center">
                  <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                    {/* Full Arc (Yellow Background) */}
                    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#ffd666" strokeWidth="6" strokeLinecap="round" />
                    {/* Red Arc overlay (approx 80%) */}
                    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#ff4d4f" strokeWidth="6" strokeLinecap="round" strokeDasharray="113 141.3" />
                  </svg>
                  <div className="flex flex-col items-center translate-y-3">
                    <span className="text-[32px] font-semibold text-gray-900 leading-none">2060</span>
                    <span className="text-[13px] text-gray-500 mt-1.5 font-medium">Total secrets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Line Chart */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-base">Risk trend over time</CardTitle>
                <div className="flex items-center gap-2">
                  <button className="flex bg-gray-300 items-center text-sm font-medium border border-gray-200 rounded-md px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 relative">
                    5 days <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <LineChart />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Spans 1/3) */}
        <div className="xl:col-span-1 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="pt-5 pb-3 border-b border-gray-100/50">
              <CardTitle className="text-[15px] font-semibold text-gray-900">Quick summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ul className="flex flex-col h-full">
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><Server className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Monitored tokens</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">4,657</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><Key className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Total NHIs</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">1,560</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><Users className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Total users</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">20</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><AlertTriangle className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Total secrets</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">17</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><AlertTriangle className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Secrets exposed</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">17</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><Users className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Total active users</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">20</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><Key className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Total NHIs</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">1,560</p></div>
                </li>
                <li className="flex items-center gap-3 py-2.5 px-5">
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 shrink-0"><UserX className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex flex-col"><p className="text-[12px] font-medium text-gray-500 mb-0.5">Ex employee access</p><p className="text-[18px] font-semibold text-gray-900 leading-tight">20</p></div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Non Human Identity Posture */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4 tracking-tight">Non Human Identity Posture</h2>

        {/* Tabs */}
        <div className="flex items-center space-x-6 border-b border-gray-200 mb-6">
          {['VCS', 'Storage/buckets', 'Cloud infra', 'Directory services'].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-sm font-medium transition-colors relative ${i === 0 ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab}
              {i === 0 && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Stacked Chart & Info Panel */}
        <Card>
          <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 py-4">Top 10 secret types in cloud storage</h3>
              <StackedBarChart />
            </div>

            {/* Context Panel (Slack) */}
            <div className="w-[200px] shrink-0 border border-gray-100 rounded-lg p-3 shadow-sm bg-white self-start lg:mt-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/slack.png" alt="Slack" className="w-4 h-4 object-contain" />
                  <span className="font-semibold text-gray-900 text-[11px]">Slack</span>
                </div>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-gray-50 text-gray-500 rounded border-gray-200">View more</Badge>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Selected value</span><span className="font-semibold text-gray-900">3</span></div>
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Total</span><span className="font-semibold text-gray-900">3</span></div>
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Critical</span><span className="font-semibold text-gray-900">3</span></div>
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Risky</span><span className="font-semibold text-gray-900">0</span></div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-900 mb-1.5">Source breakdown</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Gitlab</span><span className="font-semibold text-gray-900">2</span></div>
                  <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500">Github</span><span className="font-semibold text-gray-900">1</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
