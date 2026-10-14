// Sends a request and returns the JSON reply. If the server says no, throws an Error
// whose .errors holds the list of messages (e.g. impossible-combo errors from a 400)
const request = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()

    if (!response.ok) {
        const errors = data.errors ?? [data.error ?? `Request failed (${response.status})`]
        const error = new Error(errors.join(' '))
        error.errors = errors
        throw error
    }

    return data
}

const getAllShinobi = () => request('/api/shinobi')

const getShinobiById = (id) => request(`/api/shinobi/${id}`)

const createShinobi = (shinobi) =>
    request('/api/shinobi', { method: 'POST', body: JSON.stringify(shinobi) })

const updateShinobi = (id, shinobi) =>
    request(`/api/shinobi/${id}`, { method: 'PATCH', body: JSON.stringify(shinobi) })

const deleteShinobi = (id) => request(`/api/shinobi/${id}`, { method: 'DELETE' })

export default {
    getAllShinobi,
    getShinobiById,
    createShinobi,
    updateShinobi,
    deleteShinobi
}
