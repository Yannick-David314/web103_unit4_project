import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewShinobi from './pages/ViewShinobi'
import EditShinobi from './pages/EditShinobi'
import CreateShinobi from './pages/CreateShinobi'
import ShinobiDetails from './pages/ShinobiDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreateShinobi title='SHIPPUDEN SHINOBI | Create' />
    },
    {
      path:'/shinobi',
      element: <ViewShinobi title='SHIPPUDEN SHINOBI | Roster' />
    },
    {
      path: '/shinobi/:id',
      element: <ShinobiDetails title='SHIPPUDEN SHINOBI | View' />
    },
    {
      path: '/edit/:id',
      element: <EditShinobi title='SHIPPUDEN SHINOBI | Edit' />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App
