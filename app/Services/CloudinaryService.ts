const cloudinary = require('cloudinary');
import Env from '@ioc:Adonis/Core/Env'

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET')
});

export default cloudinary;