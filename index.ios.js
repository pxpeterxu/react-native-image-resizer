import { NativeModules } from 'react-native';
import { validateOptions } from './common';

export default {
  createResizedImage: (
    path,
    width,
    height,
    format,
    quality,
    rotation = 0,
    outputPath,
    keepMeta = false,
    options = {}
  ) => {
    if (format !== 'JPEG' && format !== 'PNG') {
      throw new Error('Only JPEG and PNG format are supported by createResizedImage');
    }

    const validatedOptions = validateOptions(options);

    return new Promise((resolve, reject) => {
      NativeModules.ImageResizer.createResizedImage(
        path,
        width,
        height,
        format,
        quality,
        rotation,
        outputPath,
        keepMeta,
        validatedOptions,
        (err, response) => {
          if (err) {
            return reject(err);
          }

          resolve(response);
        }
      );
    });
  },
};
