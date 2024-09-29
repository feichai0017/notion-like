import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // 假设您的API基础URL是'/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 拦截器添加认证token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // 认证相关
  register: (userData: any) => apiClient.post('/register', userData),
  login: (credentials: any) => apiClient.post('/login', credentials),

 // 修改 LaTeX 编译方法
 compileLatex: (latexCode: string) => 
    apiClient.post('/compile-latex', { latex: latexCode }, {
      responseType: 'json' // 确保响应类型为 JSON
    }),

  // 文档相关
  getDocuments: () => apiClient.get('/documents'),
  getDocument: (id: string) => apiClient.get(`/documents/${id}`),
  createDocument: (documentData: any) => apiClient.post('/documents', documentData),
  updateDocument: (id: string, documentData: any) => apiClient.put(`/documents/${id}`, documentData),
  deleteDocument: (id: string) => apiClient.delete(`/documents/${id}`),

  // 待办事项相关
  getTodos: () => apiClient.get('/todos'),
  getTodo: (id: string) => apiClient.get(`/todos/${id}`),
  createTodo: (todoData: any) => apiClient.post('/todos', todoData),
  updateTodo: (id: string, todoData: any) => apiClient.put(`/todos/${id}`, todoData),
  deleteTodo: (id: string) => apiClient.delete(`/todos/${id}`),

  // OpenAI completion (从您提供的前端代码中添加)
  getCompletion: (prompt: string) => apiClient.post('/completion', { prompt }),
};

export default api;