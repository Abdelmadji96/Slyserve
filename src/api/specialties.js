import { API_URL } from '../../constants';

export const fetchSpecialites = async () => {
  const response = await fetch(API_URL + '/professionnels/specialites', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  });
  const responseJson = await response.json();
  console.log('responseJson', responseJson);
  return responseJson;
};
