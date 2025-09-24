export default function Timeline() {
  const events = [{ date: '2025-01-01', desc: 'Initial scan uploaded' }]
  return (<ul className="border-l-4 border-hibaRed pl-4 space-y-4">{events.map((e,i)=>(<li key={i}><div className="text-sm text-hibaBlack font-bold">{e.date}</div><div className="text-hibaYellow">{e.desc}</div></li>))}</ul>)
}
