const axios = require("axios");

export const getRequest = async (url: string): Promise<any> => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(error);
    return "Error, there was a problem with the request";
  }
};
export const postRequest = async (url: string, body: any): Promise<any> => {
  try {
    const { data } = await axios.post(url, body);
    return data;
  } catch (error) {
    console.error(error);
    return "Error, there was a problem with the request";
  }
};
