import express from 'express'
import ShinobiController from '../controllers/shinobi.js'

const router = express.Router()

router.get('/', ShinobiController.getShinobi)
router.get('/:id', ShinobiController.getShinobiById)
router.post('/', ShinobiController.createShinobi)
router.patch('/:id', ShinobiController.updateShinobi)
router.delete('/:id', ShinobiController.deleteShinobi)

export default router
