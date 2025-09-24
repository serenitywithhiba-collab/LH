import Image from 'next/image'
import { useState } from 'react'
export default function BeforeAfterCompare({ beforeUrl, afterUrl }) {
  const [slider, setSlider] = useState(50)
  return (
    <div className="relative w-full h-96 overflow-hidden border-2 border-hibaRed rounded">
      <div className="absolute top-0 left-0 w-full h-full"><Image src={beforeUrl} alt="Before" fill className="object-cover" /></div>
      <div className="absolute top-0 left-0 h-full" style={{ width: `${slider}%` }}><Image src={afterUrl} alt="After" fill className="object-cover" /></div>
      <input type="range" min="0" max="100" value={slider} onChange={(e)=>setSlider(Number(e.target.value))} className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 accent-hibaYellow" />
    </div>
  )
}
