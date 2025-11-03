import express from 'express'
import { createInvoice, deleteInvoiceById, getInvoiceByCompanyId, getLastInvoiceNumber } from '../controllers/invoice.controller.js'
const router=express.Router()

router.post('/:companyId',createInvoice);
router.get('/:companyId',getInvoiceByCompanyId);
router.get('/last-inv/:companyId',getLastInvoiceNumber)
router.delete('/:invoiceId',deleteInvoiceById)
export default router