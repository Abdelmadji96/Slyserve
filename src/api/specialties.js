import {API_URL} from '@env';

export const fetchSpecialites = async () => {
  const response = await fetch(API_URL + '/professionnels/specialites', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
};
