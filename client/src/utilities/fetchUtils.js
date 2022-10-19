const USERMANAGE_URL = "http://localhost:5000/usermanage";
const SERVER_URL = "http://localhost:8090/api";

async function usermanageReq(path, body) {
  try {
    const raw = JSON.stringify(body);
    const res = await fetch(`${USERMANAGE_URL}${path}`, {
      method: "POST",
      headers: new Headers({ "Content-type": "application/json" }),
      body: raw
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return [data];
  } catch (error) {
    return [false, error];
  }
}

async function postReq(path, body) {
  try {
    const raw = body ? JSON.stringify(body) : null;
    const res = await fetch(`${SERVER_URL}${path}`, {
      method: "POST",
      headers: new Headers({ "Content-type": "application/json" }),
      body: raw
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return [data];
  } catch (error) {
    return [false, error];
  }
}

async function getReq(path) {
  try {
    const res = await fetch(`${SERVER_URL}${path}`, {
      method: "GET"
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return [data];
  } catch (error) {
    return [false, error];
  }
}

export { getReq, postReq, usermanageReq };
