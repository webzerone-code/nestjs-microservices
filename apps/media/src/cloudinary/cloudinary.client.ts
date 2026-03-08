import { v2 as cloudinary } from 'cloudinary';

export function initCloudinary() {
  const cloudName: string | undefined =
    process.env.CLOUDINARY_API_NAME ??
    (() => {
      throw new Error('cloudName missing');
    })();
  const apiKey: string | undefined =
    process.env.CLOUDINARY_API_KEY ??
    (() => {
      throw new Error('apikey missing');
    })();
  const secretKey: string | undefined =
    process.env.CLOUDINARY_API_SECRET ??
    (() => {
      throw new Error('secretKye missing');
    })();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: secretKey,
  });
  return cloudinary;
}
