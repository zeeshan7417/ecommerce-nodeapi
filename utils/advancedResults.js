const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
  
    // Copy req.query
    const reqQuery = { ...req.query };
  
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit',];
  
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
  
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
  
        
   
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

   
    console.log(queryStr);
    
  
    // Finding resource
    query = model.find(JSON.parse(queryStr));
  
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
   
     /*search data */
    if(req.query.search){
      // var query = req.params.query;
       let queryquery = req.query.search?{
         name:{
           $regex:req.query.search,
           $options:"i"
          
         }
       }:{}
    
     query  = query.find({...queryquery});
     
     //console.log(data);
 
     
      
      }

  
 
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log('sort by', sortBy)
     
      query = query.sort(sortBy);
      
    } else {
      query = query.sort('-createdAt');
    }
  
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;

    const limit = parseInt(req.query.limit, 10) || 8;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const productsCount  = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);
  
    if (populate) {
      query = query.populate(populate);
    }
  
    // Executing query
    const results = await query;
  
    // Pagination result
    const pagination = {};
  
    if (endIndex < productsCount) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
  
    res.advancedResults = {
      success: true,
      count: results.length,
      productsCount,
      limit,
      pagination,
      data: results
    };
  
    next();
  };
  
  module.exports = advancedResults;
  