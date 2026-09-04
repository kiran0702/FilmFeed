import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getAuthHeaders = () => {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!readAccessToken) return null;
  return {
    Authorization: `Bearer ${readAccessToken}`,
    Accept: "application/json",
  };
};

const buildUrl = (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url;
};

const fetchTmdb = async (path, params = {}) => {
  const response = await fetch(buildUrl(path, params), {
    headers: getAuthHeaders() || undefined,
  });
  const payload = await response.json();
  return { status: response.status, payload };
};

async function run() {
  console.log('Fetching trending page 2...');
  const res = await fetchTmdb('/trending/movie/week', { page: 2 });
  console.log('Status:', res.status);
  console.log('Count:', res.payload.results?.length);
  
  if (res.payload.results && res.payload.results.length > 0) {
      console.log('First item:', res.payload.results[0].title);
  } else {
      console.log('Error payload:', res.payload);
  }
}

run();
