import { NativeModules } from 'react-native';
import { validateOptions } from './common';

const ImageResizerAndroid = NativeModules.ImageResizerAndroid;

export default {
  createResizedImage: (
    imagePath,
    newWidth,
    newHeight,
    compressFormat,
    quality,
    rotation = 0,
    outputPath,
    keepMeta = false,
    options = {}
  ) => {
    const validatedOptions = validateOptions(options);

    return new Promise((resolve, reject) => {
      ImageResizerAndroid.createResizedImage(
        imagePath,
        newWidth,
        newHeight,
        compressFormat,
        quality,
        rotation,
        outputPath,
        keepMeta,
        validatedOptions,
        resolve,
        reject
      );
    });
  },
};
