import React, { useState } from 'react'
import axios from 'axios'
export default function SignatureModal({ hash, onClose, onSigned }) {
  const [email, setEmail] = useState(''); const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(''); const [name, setName] = useState('')
  async function sendOtp() {
    await axios.post('/api/request-signature', { email, hash }); setOtpSent(true); alert('OTP sent to ' + email)
  }
  async function confirm() {
    const res = await axios.post('/api/confirm-signature', { hash, otp, clinicianName: name })
    if (res.data.ok) { alert('Signed'); onSigned?.(res.data); onClose?.() }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="font-bold text-hibaRed">Clinician Signature</h3>
        {!otpSent ? (
          <>
            <p>Enter clinician email to receive OTP</p>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border mt-2" />
            <div className="mt-4"><button onClick={sendOtp} className="px-4 py-2 bg-hibaRed text-white rounded">Send OTP</button></div>
          </>
        ) : (
          <>
            <p>Enter OTP and clinician name</p>
            <input value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full p-2 border mt-2" placeholder="OTP" />
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 border mt-2" placeholder="Clinician Name" />
            <div className="mt-4"><button onClick={confirm} className="px-4 py-2 bg-hibaRed text-white rounded">Confirm Signature</button></div>
          </>
        )}
        <div className="mt-4"><button onClick={onClose} className="text-sm">Close</button></div>
      </div>
    </div>
  )
}
