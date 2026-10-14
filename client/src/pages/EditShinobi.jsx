import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ShinobiForm from '../components/ShinobiForm'
import ShinobiAPI from '../services/ShinobiAPI'
import '../App.css'

const EditShinobi = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shinobi, setShinobi] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        (async () => {
            try {
                const data = await ShinobiAPI.getShinobiById(id)
                // Only the editable fields go into the form
                const { name, village, clan, chakra_nature, kekkei_genkai, rank, specialty } = data
                setShinobi({ name, village, clan, chakra_nature, kekkei_genkai, rank, specialty })
            }
            catch (err) {
                setError(err.message)
            }
        }) ()
    }, [id])

    const handleUpdate = async (changes) => {
        await ShinobiAPI.updateShinobi(id, changes)
        navigate(`/shinobi/${id}`)
    }

    if (error) {
        return (
            <main className='page'>
                <p className='page-error' role='alert'>{error}</p>
                <Link to='/shinobi' role='button'>Back to roster</Link>
            </main>
        )
    }

    if (!shinobi) {
        return <main className='page'><h2 aria-busy='true'>Loading...</h2></main>
    }

    return (
        <main className='page'>
            <h2>Edit {shinobi.name}</h2>
            <p className='page-subtitle'>Change any choice. The fee and rules update just like on the create page.</p>
            <ShinobiForm initialShinobi={shinobi} submitLabel='Save Changes' onSubmit={handleUpdate} />
        </main>
    )
}

export default EditShinobi
