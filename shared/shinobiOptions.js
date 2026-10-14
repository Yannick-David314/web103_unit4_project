// Every option a shinobi can have, what it adds to the mission fee (in ryō),
// and the rules for which combinations are impossible.
// Both the server (to validate before saving) and the client (to build the form,
// show the live fee and warn early) import this file, so the rules live in one place.

export const villages = [
    { value: 'Leaf', label: 'Hidden Leaf (Konoha)', symbol: '木', fee: 2000 },
    { value: 'Sand', label: 'Hidden Sand (Suna)', symbol: '砂', fee: 1500 },
    { value: 'Mist', label: 'Hidden Mist (Kiri)', symbol: '霧', fee: 1500 },
    { value: 'Cloud', label: 'Hidden Cloud (Kumo)', symbol: '雲', fee: 1500 },
    { value: 'Stone', label: 'Hidden Stone (Iwa)', symbol: '岩', fee: 1500 }
]

// village: the only village this clan can belong to (null = any village)
export const clans = [
    { value: 'None', label: 'No clan', village: null, fee: 0 },
    { value: 'Uchiha', label: 'Uchiha', village: 'Leaf', fee: 8000 },
    { value: 'Hyuga', label: 'Hyuga', village: 'Leaf', fee: 7000 },
    { value: 'Senju', label: 'Senju', village: 'Leaf', fee: 8000 },
    { value: 'Uzumaki', label: 'Uzumaki', village: 'Leaf', fee: 7000 },
    { value: 'Nara', label: 'Nara', village: 'Leaf', fee: 4000 },
    { value: 'Akimichi', label: 'Akimichi', village: 'Leaf', fee: 3500 },
    { value: 'Yamanaka', label: 'Yamanaka', village: 'Leaf', fee: 3500 },
    { value: 'Aburame', label: 'Aburame', village: 'Leaf', fee: 3500 },
    { value: 'Inuzuka', label: 'Inuzuka', village: 'Leaf', fee: 3000 },
    { value: 'Yuki', label: 'Yuki', village: 'Mist', fee: 5000 },
    { value: 'Kaguya', label: 'Kaguya', village: 'Mist', fee: 5000 },
    { value: 'Hozuki', label: 'Hozuki', village: 'Mist', fee: 4500 }
]

// color: the aura color shown around the shinobi preview
export const chakraNatures = [
    { value: 'Fire', label: 'Fire', color: '#ff4d2e', fee: 1000 },
    { value: 'Wind', label: 'Wind', color: '#6fe39a', fee: 1000 },
    { value: 'Lightning', label: 'Lightning', color: '#ffe14d', fee: 1000 },
    { value: 'Earth', label: 'Earth', color: '#c08a4e', fee: 1000 },
    { value: 'Water', label: 'Water', color: '#3fa9f5', fee: 1000 }
]

// clan: requires this clan. villages: requires one of these villages. (null = no requirement)
export const kekkeiGenkai = [
    { value: 'None', label: 'None', clan: null, villages: null, fee: 0 },
    { value: 'Sharingan', label: 'Sharingan', clan: 'Uchiha', villages: null, fee: 25000 },
    { value: 'Byakugan', label: 'Byakugan', clan: 'Hyuga', villages: null, fee: 20000 },
    { value: 'Wood Release', label: 'Wood Release', clan: 'Senju', villages: null, fee: 40000 },
    { value: 'Ice Release', label: 'Ice Release', clan: 'Yuki', villages: null, fee: 15000 },
    { value: 'Shikotsumyaku', label: 'Shikotsumyaku', clan: 'Kaguya', villages: null, fee: 15000 },
    { value: 'Lava Release', label: 'Lava Release', clan: null, villages: ['Mist', 'Stone'], fee: 18000 },
    { value: 'Storm Release', label: 'Storm Release', clan: null, villages: ['Cloud'], fee: 18000 },
    { value: 'Dust Release', label: 'Dust Release', clan: null, villages: ['Stone'], fee: 45000 },
    { value: 'Magnet Release', label: 'Magnet Release', clan: null, villages: ['Sand'], fee: 12000 }
]

// rank sets the base fee
export const ranks = [
    { value: 'Academy Student', label: 'Academy Student', fee: 500 },
    { value: 'Genin', label: 'Genin', fee: 5000 },
    { value: 'Chunin', label: 'Chunin', fee: 15000 },
    { value: 'Jonin', label: 'Jonin', fee: 40000 },
    { value: 'ANBU', label: 'ANBU', fee: 60000 },
    { value: 'Kage', label: 'Kage', fee: 100000 }
]

export const specialties = [
    { value: 'Ninjutsu', label: 'Ninjutsu', fee: 2000 },
    { value: 'Fuinjutsu', label: 'Fuinjutsu', fee: 4000 },
    { value: 'Taijutsu', label: 'Taijutsu', fee: 1500 },
    { value: 'Genjutsu', label: 'Genjutsu', fee: 3000 }
]

// Maps each field of a shinobi to its list of options
export const features = {
    village: villages,
    clan: clans,
    chakra_nature: chakraNatures,
    kekkei_genkai: kekkeiGenkai,
    rank: ranks,
    specialty: specialties
}

export const findOption = (field, value) => features[field].find((option) => option.value === value)

// Adds up the fee of every chosen option
export const calculateFee = (shinobi) =>
    Object.keys(features).reduce((total, field) => total + (findOption(field, shinobi[field])?.fee ?? 0), 0)

// Checks only the impossible-combination rules (village + clan + kekkei genkai).
// Assumes every choice is a real option.
export const validateCombination = (shinobi) => {
    const errors = []
    const clan = findOption('clan', shinobi.clan)
    const kg = findOption('kekkei_genkai', shinobi.kekkei_genkai)

    if (clan.village && clan.village !== shinobi.village) {
        errors.push(`The ${clan.label} clan belongs to the Hidden ${clan.village}, not the Hidden ${shinobi.village}.`)
    }

    if (kg.clan && kg.clan !== shinobi.clan) {
        errors.push(`The ${kg.label} can only be inherited by the ${kg.clan} clan.`)
    }

    if (kg.villages && !kg.villages.includes(shinobi.village)) {
        errors.push(`${kg.label} is only found in the Hidden ${kg.villages.join(' or Hidden ')}.`)
    }

    return errors
}

// Full check before saving. Returns a list of error messages; an empty list means the shinobi is valid
export const validateShinobi = (shinobi) => {
    const errors = []

    if (!shinobi.name || !shinobi.name.trim()) {
        errors.push('Your shinobi needs a name.')
    }

    for (const field of Object.keys(features)) {
        if (!findOption(field, shinobi[field])) {
            errors.push(`"${shinobi[field]}" is not a valid ${field.replace('_', ' ')}.`)
        }
    }

    const hasUnknownOption = Object.keys(features).some((field) => !findOption(field, shinobi[field]))

    // The combination rules assume valid options, so skip them if any choice is unknown
    return hasUnknownOption ? errors : [...errors, ...validateCombination(shinobi)]
}
