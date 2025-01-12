import { NativeModules, Platform } from 'react-native';

/** Validate `options` object: used by both Android and iOS entry points */
export function validateOptions(options) {
  // Validate mode
  const mode = options.mode || 'stretch';
  const possibleModes = ['contain', 'cover', 'stretch'];
  if (possibleModes.indexOf(mode) === -1) {
    throw new Error(`createResizedImage's options.mode must be one of "${possibleModes.join('", "')}"`);
  }

  // Validate onlyScaleDown
  if (options.onlyScaleDown && typeof options.onlyScaleDown !== 'boolean') {
    throw new Error(`createResizedImage\'s option.onlyScaleDown must be a boolean: got ${options.onlyScaleDown}`);
  }

  // Validate priority
  const priority = options.priority || 'default';
  const possiblePriorities = ['default', 'high', 'low'];
  if (possiblePriorities.indexOf(priority) === -1) {
    throw new Error(`createResizedImage's options.priority must be one of "${possiblePriorities.join('", "')}"`);
  }

  return {
    mode,
    onlyScaleDown: !!options.onlyScaleDown,
    priority,
  };
}

const ImageResizerAndroid = NativeModules.ImageResizerAndroid;

let exportObject = {};

if (Platform.OS === 'android') {
  exportObject = {
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
} else {
  exportObject = {
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
}

export default exportObject;
