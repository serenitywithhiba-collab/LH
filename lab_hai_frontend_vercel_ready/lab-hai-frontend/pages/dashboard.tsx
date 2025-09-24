import Header from '../components/Header'
import Timeline from '../components/Timeline'
import BeforeAfterCompare from '../components/BeforeAfterCompare'
import { ReportCard } from '../components/ReportCard'
import { ChartSection } from '../components/ChartSection'
import ExportReportButton from '../components/ExportReportButton'
import { useRef } from 'react'
export default function Dashboard() {
  const dashboardRef = useRef(null)
  const patient = { id: 'demo-patient', study: 'Demo Study', timeline: [] }
  return (
    <div className="min-h-screen bg-hibaWhite text-hibaBlack">
      <Header />
      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-hibaWhite border-2 border-hibaRed rounded-2xl shadow p-4">
          <h2 className="text-xl font-bold text-hibaRed mb-4">Patient Timeline</h2>
          <Timeline />
        </section>
        <section className="lg:col-span-2 bg-hibaWhite border-2 border-hibaRed rounded-2xl shadow p-4" ref={dashboardRef}>
          <h2 className="text-xl font-bold text-hibaRed mb-4">Before / After</h2>
          <BeforeAfterCompare beforeUrl="/logo.svg" afterUrl="/logo.svg" />
        </section>
        <section className="lg:col-span-2 bg-hibaWhite border-2 border-hibaRed rounded-2xl shadow p-4">
          <h2 className="text-xl font-bold text-hibaRed mb-4">Analysis Charts</h2>
          <ChartSection />
        </section>
        <section className="lg:col-span-1 bg-hibaWhite border-2 border-hibaRed rounded-2xl shadow p-4">
          <h2 className="text-xl font-bold text-hibaRed mb-4">Reports</h2>
          <ReportCard />
          <div className="mt-4">
            <ExportReportButton dashboardRef={dashboardRef} patient={patient} />
          </div>
        </section>
      </main>
    </div>
  )
}
