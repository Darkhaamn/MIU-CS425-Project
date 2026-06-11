import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-slate-900">CarShareX</p>
            <p className="mt-2 text-sm text-slate-500">
              Premium peer-to-peer car rental. Drive what you want, when you want.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Rent</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/cars" className="hover:text-slate-900">Browse cars</Link></li>
              <li><Link to="/customer/register" className="hover:text-slate-900">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Supplier</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/supplier/register" className="hover:text-slate-900">List your car</Link></li>
              <li><Link to="/supplier/login" className="hover:text-slate-900">Supplier login</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/admin/login" className="hover:text-slate-900">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} CarShareX. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
