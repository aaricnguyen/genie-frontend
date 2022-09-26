import { instance } from "./http";

export const parserPython = async (data, cliCommand) => {
  try {
    return await instance.post(`/parser?cli_command=${cliCommand}`, data);
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

export const testPython = async (data, cliCommand) => {
  try {
    return await instance.post(`/test?cli_command=${cliCommand}`, data);
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}
