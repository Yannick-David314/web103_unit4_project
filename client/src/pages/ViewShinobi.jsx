import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ShinobiPreview from '../components/ShinobiPreview'
import ShinobiAPI from '../services/ShinobiAPI'
import '../App.css'
import '../css/ShinobiPages.css'

const ViewShinobi = ({ title }) => {
    const [shinobiList, setShinobiList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        (async () => {
            try {
                setShinobiList(await ShinobiAPI.getAllShinobi())
            }
            catch (err) {
                setError(err.message)
            }
            finally {
                setLoading(false)
            }
        }) ()
    }, [])

    const handleDelete = async (shinobi) => {
        if (!window.confirm(`Delete ${shinobi.name}? This can't be undone.`)) return

        try {
            await ShinobiAPI.deleteShinobi(shinobi.id)
            setShinobiList((current) => current.filter((s) => s.id !== shinobi.id))
        }
        catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <main className='page'><h2 aria-busy='true'>Loading shinobi...</h2></main>
    }

    return (
        <main className='page'>
            <h2>Shinobi Roster</h2>
            <p className='page-subtitle'>{shinobiList.length} shinobi ready for missions</p>

            {error && <p className='page-error' role='alert'>{error}</p>}

            {
                shinobiList.length === 0
                    ? <p>No shinobi yet. <Link to='/'>Create the first one!</Link></p>
                    : <div className='shinobi-grid'>
                        {
                            shinobiList.map((shinobi) =>
                                <article key={shinobi.id} className='shinobi-card'>
                                    <Link to={`/shinobi/${shinobi.id}`} className='shinobi-card-preview'>
                                        <ShinobiPreview shinobi={shinobi} size='small' />
                                    </Link>

                                    <div className='shinobi-card-info'>
                                        <h3><Link to={`/shinobi/${shinobi.id}`}>{shinobi.name}</Link></h3>
                                        <p className='shinobi-card-rank'>{shinobi.rank} · Hidden {shinobi.village}</p>
                                        <ul>
                                            <li><span>Clan</span> {shinobi.clan === 'None' ? 'No clan' : shinobi.clan}</li>
                                            <li><span>Chakra</span> {shinobi.chakra_nature}</li>
                                            <li><span>Kekkei Genkai</span> {shinobi.kekkei_genkai}</li>
                                            <li><span>Specialty</span> {shinobi.specialty}</li>
                                        </ul>
                                        <p className='shinobi-card-fee'>{shinobi.mission_fee.toLocaleString('en-US')} ryō</p>
                                    </div>

                                    <footer>
                                        <Link to={`/edit/${shinobi.id}`} role='button' className='secondary'>Edit</Link>
                                        <button className='delete-button' onClick={() => handleDelete(shinobi)}>Delete</button>
                                    </footer>
                                </article>
                            )
                        }
                    </div>
            }
        </main>
    )
}

export default ViewShinobi
