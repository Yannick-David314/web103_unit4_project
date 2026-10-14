import React, { useState } from 'react'
import ShinobiPreview from './ShinobiPreview'
import {
    villages, clans, chakraNatures, kekkeiGenkai, ranks, specialties,
    calculateFee, validateCombination, validateShinobi
} from '../../../shared/shinobiOptions.js'
import '../css/ShinobiForm.css'

const fields = [
    { field: 'village', label: 'Village', options: villages },
    { field: 'clan', label: 'Clan', options: clans },
    { field: 'chakra_nature', label: 'Chakra Nature', options: chakraNatures },
    { field: 'kekkei_genkai', label: 'Kekkei Genkai', options: kekkeiGenkai },
    { field: 'rank', label: 'Rank', options: ranks },
    { field: 'specialty', label: 'Specialty', options: specialties }
]

export const defaultShinobi = {
    name: '',
    village: 'Leaf',
    clan: 'None',
    chakra_nature: 'Fire',
    kekkei_genkai: 'None',
    rank: 'Genin',
    specialty: 'Ninjutsu'
}

const formatRyo = (amount) => `${amount.toLocaleString('en-US')} ryō`

// Shared by the Create and Edit pages. onSubmit receives the choices and should
// return a promise; if it throws an error with .errors, those messages are shown.
const ShinobiForm = ({ initialShinobi = defaultShinobi, submitLabel, onSubmit }) => {
    const [shinobi, setShinobi] = useState(initialShinobi)
    const [submitErrors, setSubmitErrors] = useState([])
    const [saving, setSaving] = useState(false)

    const comboErrors = validateCombination(shinobi)
    const fee = calculateFee(shinobi)

    const handleChange = (event) => {
        const { name, value } = event.target
        setShinobi((current) => ({ ...current, [name]: value }))
        setSubmitErrors([])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        // Check in the browser first for an instant message; the server checks again before saving
        const errors = validateShinobi(shinobi)
        if (errors.length > 0) {
            setSubmitErrors(errors)
            return
        }

        try {
            setSaving(true)
            await onSubmit(shinobi)
        }
        catch (error) {
            setSubmitErrors(error.errors ?? [error.message])
        }
        finally {
            setSaving(false)
        }
    }

    return (
        <form className='shinobi-form' onSubmit={handleSubmit}>
            <div className='shinobi-form-preview'>
                <ShinobiPreview shinobi={shinobi} />
                <p className='shinobi-form-name'>{shinobi.name.trim() || 'Unnamed Shinobi'}</p>
                <p className='shinobi-form-fee'>
                    Mission fee
                    <strong>{formatRyo(fee)}</strong>
                </p>
            </div>

            <div className='shinobi-form-fields'>
                <label>
                    Name
                    <input
                        type='text'
                        name='name'
                        value={shinobi.name}
                        onChange={handleChange}
                        placeholder='e.g. Kaito Uchiha'
                        maxLength={100}
                    />
                </label>

                <div className='shinobi-form-grid'>
                    {
                        fields.map(({ field, label, options }) =>
                            <label key={field}>
                                {label}
                                <select name={field} value={shinobi[field]} onChange={handleChange}>
                                    {
                                        options.map((option) =>
                                            <option key={option.value} value={option.value}>
                                                {option.label}{option.fee > 0 ? ` (+${formatRyo(option.fee)})` : ''}
                                            </option>
                                        )
                                    }
                                </select>
                            </label>
                        )
                    }
                </div>

                {
                    comboErrors.length > 0 && submitErrors.length === 0 &&
                    <div className='shinobi-form-warning' role='status'>
                        <strong>⚠️ Impossible combination</strong>
                        <ul>{comboErrors.map((error) => <li key={error}>{error}</li>)}</ul>
                    </div>
                }

                {
                    submitErrors.length > 0 &&
                    <div className='shinobi-form-error' role='alert'>
                        <strong>Couldn't save this shinobi:</strong>
                        <ul>{submitErrors.map((error) => <li key={error}>{error}</li>)}</ul>
                    </div>
                }

                <button type='submit' aria-busy={saving} disabled={saving}>{submitLabel}</button>
            </div>
        </form>
    )
}

export default ShinobiForm
