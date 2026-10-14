import { pool } from '../config/database.js'
import { calculateFee, validateShinobi } from '../../shared/shinobiOptions.js'

// Copies only the fields we expect from the request body, so extra fields
// (like a made-up mission_fee) are ignored
const pickShinobiFields = (body) => ({
    name: typeof body.name === 'string' ? body.name.trim() : body.name,
    village: body.village,
    clan: body.clan,
    chakra_nature: body.chakra_nature,
    kekkei_genkai: body.kekkei_genkai,
    rank: body.rank,
    specialty: body.specialty
})

const getShinobi = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM shinobi ORDER BY id ASC')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getShinobiById = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM shinobi WHERE id = $1', [req.params.id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Shinobi not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createShinobi = async (req, res) => {
    const shinobi = pickShinobiFields(req.body)
    const errors = validateShinobi(shinobi)

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    try {
        const results = await pool.query(
            `INSERT INTO shinobi (name, village, clan, chakra_nature, kekkei_genkai, rank, specialty, mission_fee)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [shinobi.name, shinobi.village, shinobi.clan, shinobi.chakra_nature,
             shinobi.kekkei_genkai, shinobi.rank, shinobi.specialty, calculateFee(shinobi)]
        )
        res.status(201).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateShinobi = async (req, res) => {
    const shinobi = pickShinobiFields(req.body)
    const errors = validateShinobi(shinobi)

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    try {
        const results = await pool.query(
            `UPDATE shinobi
             SET name = $1, village = $2, clan = $3, chakra_nature = $4,
                 kekkei_genkai = $5, rank = $6, specialty = $7, mission_fee = $8
             WHERE id = $9
             RETURNING *`,
            [shinobi.name, shinobi.village, shinobi.clan, shinobi.chakra_nature,
             shinobi.kekkei_genkai, shinobi.rank, shinobi.specialty, calculateFee(shinobi), req.params.id]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Shinobi not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteShinobi = async (req, res) => {
    try {
        const results = await pool.query('DELETE FROM shinobi WHERE id = $1 RETURNING *', [req.params.id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Shinobi not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    getShinobi,
    getShinobiById,
    createShinobi,
    updateShinobi,
    deleteShinobi
}
