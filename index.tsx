// index.tsx
// Ponto de entrada principal da aplicação React.
// Responsável por renderizar o componente App no elemento DOM com id 'root'.

import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa o novo cliente ReactDOM para React 18+
import App from './App'; // Importa o componente principal da aplicação

// Obtém o elemento DOM onde a aplicação React será montada.
const rootElement = document.getElementById('root');

// Verifica se o elemento 'root' existe no HTML. Se não, lança um erro.
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento raiz para montar a aplicação.");
}

// Cria a raiz da aplicação React usando o novo API createRoot.
const root = ReactDOM.createRoot(rootElement);

// Renderiza o componente App dentro de React.StrictMode.
// React.StrictMode ativa verificações e avisos adicionais para desenvolvimento.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);