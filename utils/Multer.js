const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        
 cb(null, new Date().toISOString()+ '-'+file.originalname)
    }
})

  const filefilter =(req, file,cb)=>{
      if(file.minetype==='image/jpeg'|| file.minetype==='image/png'){
          cb(null, true)
      }
   else{
       cb({message:"file not suppoerted"})
   }
  }

   const upload = multer({
       storage:storage,
       limits:{fileSize:1024*1024},
       fileFilter:filefilter
   })

    module.exports= upload

   