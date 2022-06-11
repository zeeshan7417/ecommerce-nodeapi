const cloudinary = require('cloudinary')


  exports.upload = (file, folder)=>{
      return new Promise(resolve=>{
        cloudinary.v2.uploader.upload(file,(result)=>{
            resolve({
                url: result.url,
                id:result.public_id
            })
        },
        
        {
            resorce_type: 'auto',
            folder:'shop'

        })
      })

  }