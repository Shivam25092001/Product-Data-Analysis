import express from "express";
import { getPieChart, getBarChart, totalSales, uploadSeedData, getStats } from "../controllers/sale.control.js";

const router = express.Router();

router.get('/upload', uploadSeedData);
router.get('/stats/total-sales', totalSales);
router.get('/stats/bar-chart', getBarChart);
router.get('/stats/pie-chart', getPieChart);
router.get('/stats', getStats);

export default router;