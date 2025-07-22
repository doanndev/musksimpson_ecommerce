import multer from 'multer';

const uploadMulter = multer({
  storage: multer.memoryStorage(),
});

export default uploadMulter;
