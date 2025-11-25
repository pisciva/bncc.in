const API_URL = process.env.REACT_APP_BACKEND_URL

export const fetchLinks = async () => {
    const res = await fetch(`${API_URL}/api/links`);
    return res.json();
}
