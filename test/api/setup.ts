import { setToken } from "./client/apiClient";
import { v4 as uuidv4 } from 'uuid';

const TOKEN = process.env.API_TEST_AUTH_TOKEN ?? uuidv4();
process.env.API_TEST_AUTH_TOKEN = TOKEN; 
setToken(TOKEN!);