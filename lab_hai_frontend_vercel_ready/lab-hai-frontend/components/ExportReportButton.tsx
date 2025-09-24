import axios from 'axios'
import html2canvas from 'html2canvas'
import React, { useState } from 'react'
import SignatureModal from './SignatureModal'
export default function ExportReportButton({ dashboardRef, patient }) {
  const [lastReport, setLastReport] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  async function captureAndExport() {
    if (!dashboardRef.current) return
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const payload = { patient, generatedAt: new Date().toISOString(), chartImage: imgData, meta: { model:'HAI-v1.2' } }
    const res = await axios.post('/api/export-report-with-qr', payload)
    if (res.data?.ok) {
      setLastReport({ hash: res.data.hash, pdfUrl: res.data.pdfUrl })
      window.open(res.data.pdfUrl, '_blank')
      alert('Report generated and uploaded. You can now request clinician signature.')
    } else {
      alert('Failed to generate report')
    }
  }
  return (
    <div>
      <button onClick={captureAndExport} className="px-4 py-2 bg-hibaRed text-hibaWhite rounded">Export & Upload PDF</button>
      {lastReport && <div className="mt-2"><button onClick={()=>setModalOpen(true)} className="px-3 py-1 bg-hibaBlack text-hibaWhite rounded">Sign Report</button></div>}
      {modalOpen && <SignatureModal hash={lastReport.hash} onClose={()=>setModalOpen(false)} onSigned={(s)=>{ alert('Report signed'); setModalOpen(false)}} />}
    </div>
  )
}
