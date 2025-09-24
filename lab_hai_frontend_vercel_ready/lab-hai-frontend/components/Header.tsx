import Link from 'next/link'
export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-hibaBlack text-hibaWhite">
      <Link href="/"><span className="text-3xl font-extrabold text-hibaRed">H</span></Link>
      <nav><ul className="flex space-x-4"><li><Link href="/dashboard"><a className="hover:text-hibaYellow">Dashboard</a></Link></li></ul></nav>
    </header>
  )
}
