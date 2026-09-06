import { Link } from 'react-router-dom'
import logo from '../assets/brand/modz_tech_logo.png'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="Modz Tech" className="h-9 w-auto sm:h-10" />
    </Link>
  )
}
