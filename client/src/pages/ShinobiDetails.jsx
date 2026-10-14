import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ShinobiPreview from '../components/ShinobiPreview'
import ShinobiAPI from '../services/ShinobiAPI'
import { findOption } from '../../../shared/shinobiOptions.js'
import '../App.css'
import '../css/ShinobiPages.css'

const detailRows = [
    ['village', 'Village'],
    ['clan', 'Clan'],
    ['chakra_nature', 'Chakra Nature'],
    ['kekkei_genkai', 'Kekkei Genkai'],
    ['rank', 'Rank'],
    ['specialty', 'Specialty']
]

const ShinobiDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shinobi, setShinobi] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const data = await ShinobiAPI.getShinobiById(id)
                setShinobi(data)
                document.title = `${title} | ${data.name}`
            }
            catch (err) {
                setError(err.message)
            }
        }) ()
    }, [id, title])

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${shinobi.name}? This can't be undone.`)) return

        try {
            await ShinobiAPI.deleteShinobi(id)
            navigate('/shinobi')
        }
        catch (err) {
            setError(err.message)
        }
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
            <article className='shinobi-details'>
                <ShinobiPreview shinobi={shinobi} />

                <div className='shinobi-details-info'>
                    <h2>{shinobi.name}</h2>
                    <table>
                        <tbody>
                            {
                                detailRows.map(([field, label]) => {
                                    const option = findOption(field, shinobi[field])
                                    return (
                                        <tr key={field}>
                                            <th scope='row'>{label}</th>
                                            <td>{option?.label ?? shinobi[field]}</td>
                                            <td className='fee-cell'>+{(option?.fee ?? 0).toLocaleString('en-US')}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tr className='total-row'>
                                <th scope='row'>Mission Fee</th>
                                <td></td>
                                <td className='fee-cell'>{shinobi.mission_fee.toLocaleString('en-US')} ryō</td>
                            </tr>
                        </tbody>
                    </table>

                    <footer>
                        <Link to={`/edit/${shinobi.id}`} role='button' className='secondary'>Edit</Link>
                        <button className='delete-button' onClick={handleDelete}>Delete</button>
                    </footer>
                </div>
            </article>
        </main>
    )
}

export default ShinobiDetails
