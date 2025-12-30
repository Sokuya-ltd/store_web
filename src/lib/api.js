// API helper for making backend requests
// You can configure this with your actual backend URL later

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "An error occurred",
        }));
        throw new Error(
          error.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET"
    });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE"
    });
  }
}

const api = new ApiClient(API_BASE_URL);

export default api;

// Example usage in components:
// import api from "../lib/api";
//
// const products = await api.get("/products");
// const newProduct = await api.post("/products", { name: "New Product" });