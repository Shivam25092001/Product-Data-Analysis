import SalesTransaction from "../models/sales.model.js";
import { getTotalSalesAmount_Util, getTotalSoldItems_Util, getTotalUnsoldItems_Util } from "./sale.helper.control.js";
import asyncCatch from '../middlewares/catchAsync.js';
import ErrorHandler from '../utils/errorhandler.js';

//upload seed data to the database
const uploadSeedData = asyncCatch( async (req, res) => {

    const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    //if error reeceived in response
    if(response.status !== 200){  
        return next(new ErrorHandler(response.statusText, response.status));  
    }

    const data = await response.json();
    
    for(let i=0; i<data.length; ++i){
        const {id, title, price, description, category, image, sold, dateOfSale } = data[i];
        const _DateOfSale = new Date(dateOfSale);
        const monthOfSale = _DateOfSale.getMonth() + 1;
        const transaction_info = {id, title, price, description, category, image, sold, dateOfSale : _DateOfSale, monthOfSale };

        //saving the data in collection(salesTransaction)
        await SalesTransaction.create(transaction_info);
    }

    res.status(200).json({
        success: true,
        message: "Data uploaded successfully",
    });
    
});





// All the APIs below should take month ( expected value is any month between January to
// December ) as an input and should be matched against the field dateOfSale regardless of
// the year.

// Expencting query as ?
// month=1 => January
// .
// .
// .
// month=12 => December


// Get Sales Statistics
const totalSales = asyncCatch( async (req, res, next) => {
    // taking month input as params
    const month = req.query.month ? parseInt(req.query.month) : 1;
    if(month > 12 || month <= 0)
        return next(new ErrorHandler(400, "Please enter a valid month"));    

    const totalSalesAmount = await getTotalSalesAmount_Util(month);
    const totalSoldItems = await getTotalSoldItems_Util(month);
    const totalUnsoldItems = await getTotalUnsoldItems_Util(month);
    res.status(200).json({
        success : true,
        totalSalesAmount,
        totalSoldItems,
        totalUnsoldItems
    });
});


// Create Bar Chart
const getBarChart = asyncCatch( async (req, res, next) => {
    // taking month input as params
    const month = req.query.month ? parseInt(req.query.month) : 1;
    if(month > 12 || month <= 0)
        return next(new ErrorHandler(400, "Please enter a valid month"));   

    const _transactions = await SalesTransaction.find({ monthOfSale: month });

    const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
    ];

    // Initialize the bar chart data
    const barChartData = priceRanges.map((range) => ({
        range: `${range.min}-${range.max}`,
        count: 0,
    }));


    // group data according to price 
    // [Time complexity: O(transactions.length), (assuming priceRanges length is contant)]
    for(let i=0; i<_transactions.length; ++i){
        const price = _transactions[i].price;

        for(let j=0; j<priceRanges.length; ++j){
            if ( price >= priceRanges[i].min && price <= priceRanges[i].max )
                barChartData[i].itemCount++;
        }
    }

    res.status(200).json({
        success : true,
        barChartData
    })
});


// Create Pie Chart
const getPieChart = asyncCatch( async (req, res, next)=>{
    // taking month input as params
    const month = req.query.month ? parseInt(req.query.month) : 1;
    if(month > 12 || month <= 0)
        return next(new ErrorHandler(400, "Please enter a valid month"));  

    const result = await SalesTransaction.aggregate([
        {
            $match: {
                monthOfSale: month
            },
        },
        {
            $group: {
                _id: { category : "$category" },
                count: { $count : {} },
            }
        }
    ]);


    // restructuring the result
    const pieChartData = [];
    for(let i=0; i<result.length; ++i){
        pieChartData.push({
            category : result[i]._id.category,
            count : result[i].count
        })
    }
    

    res.status(200).json({
        success : true,
        pieChartData
    })
});


// Fetch data from all the 3 APIs
const getStats = asyncCatch( async(req, res, next) => {
    const month = req.query.month ? parseInt(req.query.month) : 1;
    if(month > 12 || month <= 0)
        return next(new ErrorHandler(400, "Please enter a valid month"));   


    const baseURL = `${req.protocol}://${req.get('host')}`;

    const __totalSales_response = await fetch(`${baseURL}/api/stats/total-sales?month=${month}`);
    const __barChart_response = await fetch(`${baseURL}/api/stats/bar-chart?month=${month}`);
    const __pieChart_response = await fetch(`${baseURL}/api/stats/pie-chart?month=${month}`);

    const __totalSales = await __totalSales_response.json();
    const __barChart = await __barChart_response.json();
    const __pieChart = await __pieChart_response.json();

    res.status(200).json({
        success : true,
        totalSales : __totalSales,
        barChart : __barChart,
        pieChart : __pieChart
    })
});




export { uploadSeedData , totalSales, getBarChart, getPieChart, getStats };

