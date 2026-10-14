import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ShinobiForm from '../components/ShinobiForm'
import ShinobiAPI from '../services/ShinobiAPI'
import '../App.css'

const CreateShinobi = ({ title }) => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = title
    }, [title])

    const handleCreate = async (shinobi) => {
        const created = await ShinobiAPI.createShinobi(shinobi)
        navigate(`/shinobi/${created.id}`)
    }

    return (
        <main className='page'>
            <h2>Create Your Shinobi</h2>
            <p className='page-subtitle'>Pick a village, bloodline and skills. Your mission fee updates as you go.</p>
            <ShinobiForm submitLabel='Create Shinobi' onSubmit={handleCreate} />
        </main>
    )
}

export default CreateShinobi
