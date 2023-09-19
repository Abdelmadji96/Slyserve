import {FIREBASE_FCM_SERVER_KEY} from '@env';

export const sendFCMNotification = async (token, title, body, data) => {
  await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_FCM_SERVER_KEY,
    },
    body: JSON.stringify({
      to: token,
      colapse_key: 'type_a',
      notification: {
        title,
        body,
        sound: 'default',
      },
      data,
    }),
  });
};
