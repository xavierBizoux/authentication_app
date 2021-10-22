import axios from 'axios';

const Instance = axios.create({
    baseURL: "https://gelenv-lts.pdcesx11145.race.sas.com",
    headers: {}
});

export default Instance;