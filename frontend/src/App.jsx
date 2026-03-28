// App.jsx - defines all routes in the app
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import Donate from './pages/Donate'
import Dashboard from './pages/Dashboard'
import Transparency from './pages/Transparency'
import Wallet from './pages/Wallet'
import CreateUser from './components/CreateUser'

export default function App() {
  return (
    <>
      <CreateUser />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/donate/:orgId" element={<Donate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </>
  )
}