import SalesTransaction from "../models/sales.model.js";


// Aggregation function to calculate the total sale amount of selected month
const getTotalSalesAmount_Util = async (month)=>{
    const result = await SalesTransaction.aggregate([
      {
        $match: {
          monthOfSale: month,
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalSalesAmount: { $sum: '$price' },
        },
      },
    ]);
  
    return result.length > 0 ? result[0].totalSalesAmount : 0;
}
  

// Aggregation function to calculate the total number of sold items of selected month
const getTotalSoldItems_Util =  async (month) => {
    const result = await SalesTransaction.aggregate([
      {
        $match: {
          monthOfSale: month,
          sold: true,
        },
      },
      {
        $count: 'totalSoldItems',
      },
    ]);
  
    return result.length > 0 ? result[0].totalSoldItems : 0;
}

  
// Aggregation function to calculate the total number of unsold items of selected month
const getTotalUnsoldItems_Util =  async (month)=>{
    const result = await SalesTransaction.aggregate([
      {
        $match: {
          monthOfSale: month,
          sold: false,
        },
      },
      {
        $count: 'totalUnsoldItems',
      },
    ]);
  
    return result.length > 0 ? result[0].totalUnsoldItems : 0;
}


export { getTotalSalesAmount_Util, getTotalSoldItems_Util, getTotalUnsoldItems_Util };