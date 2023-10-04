import { API_URL } from '../../constants';

export const fetchWilayas = async () => {
  const response = await fetch(API_URL + '/api/wilayas', {
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
