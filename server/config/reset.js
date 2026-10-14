import { pool } from './database.js'
import { calculateFee, validateShinobi } from '../../shared/shinobiOptions.js'

// A few starter shinobi so the "View Shinobi" list isn't empty
const seedShinobi = [
    { name: 'Kaito Uchiha', village: 'Leaf', clan: 'Uchiha', chakra_nature: 'Fire', kekkei_genkai: 'Sharingan', rank: 'Chunin', specialty: 'Genjutsu' },
    { name: 'Yuna Yuki', village: 'Mist', clan: 'Yuki', chakra_nature: 'Water', kekkei_genkai: 'Ice Release', rank: 'Jonin', specialty: 'Ninjutsu' },
    { name: 'Raiden', village: 'Cloud', clan: 'None', chakra_nature: 'Lightning', kekkei_genkai: 'Storm Release', rank: 'ANBU', specialty: 'Taijutsu' }
]

const createShinobiTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS shinobi;

        CREATE TABLE IF NOT EXISTS shinobi (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            village VARCHAR(50) NOT NULL,
            clan VARCHAR(50) NOT NULL,
            chakra_nature VARCHAR(50) NOT NULL,
            kekkei_genkai VARCHAR(50) NOT NULL,
            rank VARCHAR(50) NOT NULL,
            specialty VARCHAR(50) NOT NULL,
            mission_fee INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `

    try {
        await pool.query(createTableQuery)
        console.log('🎉 shinobi table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating shinobi table', error)
        throw error
    }
}

const seedShinobiTable = async () => {
    for (const shinobi of seedShinobi) {
        const errors = validateShinobi(shinobi)
        if (errors.length > 0) {
            throw new Error(`Seed shinobi ${shinobi.name} is invalid: ${errors.join(' ')}`)
        }

        const insertQuery = `
            INSERT INTO shinobi (name, village, clan, chakra_nature, kekkei_genkai, rank, specialty, mission_fee)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `
        const values = [
            shinobi.name,
            shinobi.village,
            shinobi.clan,
            shinobi.chakra_nature,
            shinobi.kekkei_genkai,
            shinobi.rank,
            shinobi.specialty,
            calculateFee(shinobi)
        ]

        try {
            await pool.query(insertQuery, values)
            console.log(`✅ ${shinobi.name} added successfully`)
        }
        catch (error) {
            console.error(`⚠️ error inserting ${shinobi.name}`, error)
            throw error
        }
    }
}

const reset = async () => {
    try {
        await createShinobiTable()
        await seedShinobiTable()
    }
    finally {
        await pool.end()
    }
}

reset()
