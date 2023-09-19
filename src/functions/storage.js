import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import {launchCamera} from 'react-native-image-picker';

export const openInBrowser = async (fieURL /*, fileSubPath*/) => {
  const res = await WebBrowser.openBrowserAsync(
    /*server + fileSubPath +*/ fieURL,
  );
  console.log(res);
};

export const checkPermission = async () => {
  try {
    const result = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    if (result) {
      return result.permissions;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getPermission = async () => {
  try {
    const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (result) {
      return result.permissions;
    }
  } catch (error) {
    console.error(error);
  }
};

const getFileExtension = fileName => {
  return fileName.split('.').pop();
};

export const uploadFile = async () => {
  let file;
  const res = await checkPermission();
  if (res.mediaLibrary.status == 'undetermined') {
    const res2 = await getPermission();
    if (res2.mediaLibrary.status == 'granted') {
      //uploadFile();
      try {
        const res = await DocumentPicker.getDocumentAsync('*/*', false, false);
        if (res.type == 'success') {
          file = {
            uri: res.uri,
            name: res.name,
            extention: getFileExtension(res.uri),
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    if (res.mediaLibrary.status == 'denied') {
      if (res.mediaLibrary.canAskAgain) {
        const res3 = await getPermission();
        if (res3.mediaLibrary.status == 'granted') {
          //uploadFile();
          try {
            const res = await DocumentPicker.getDocumentAsync(
              '*/*',
              false,
              false,
            );
            if (res.type == 'success') {
              file = {
                uri: res.uri,
                name: res.name,
                extention: getFileExtension(res.uri),
              };
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    } else {
      try {
        const res = await DocumentPicker.getDocumentAsync('*/*', false, false);
        if (res.type == 'success') {
          file = {
            uri: res.uri,
            name: res.name,
            extention: getFileExtension(res.uri),
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  return file;
};

export const uploadImage = async () => {
  let photo;
  try {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: true,
    });
    photo = {uri: result.assets.pop().uri};
  } catch (error) {
    console.log(error);
  }
  return photo;
};

// export const uploadImage = async from => {
//   let photo;
//   let res = await checkPermission();
//   if (res.mediaLibrary.status == 'undetermined') {
//     const res2 = await getPermission();
//     if (res2.mediaLibrary.status == 'granted') {
//       try {
//         let result1 = await launchCamera({
//           mediaType: 'photo',
//           cameraType: 'back',
//           includeBase64: true,
//         });
//         if (result1.assets > 0) {
//           photo = {
//             uri: result1.assets.pop().uri,
//             name: result1.assets.pop().fileName,
//             base64: result1.assets.pop().base64,
//           };
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   } else {
//     if (res.mediaLibrary.status == 'denied') {
//       if (res.mediaLibrary.canAskAgain) {
//         const res3 = await getPermission();
//         if (res3.mediaLibrary.status == 'granted') {
//           try {
//             let result1 = await launchCamera({
//               mediaType: 'photo',
//               cameraType: 'back',
//               includeBase64: true,
//             });
//             if (result1.assets > 0) {
//               photo = {
//                 uri: result1.assets.pop().uri,
//                 name: result1.assets.pop().fileName,
//                 base64: result1.assets.pop().base64,
//               };
//             }
//           } catch (error) {
//             console.error(error);
//           }
//         }
//       }
//     } else {
//       try {
//         let result1 = await launchCamera({
//           mediaType: 'photo',
//           cameraType: 'back',
//           includeBase64: true,
//         });
//         if (result1.assets > 0) {
//           photo = {
//             uri: result1.assets.pop().uri,
//             name: result1.assets.pop().fileName,
//             base64: result1.assets.pop().base64,
//           };
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
//   return photo;
// };
