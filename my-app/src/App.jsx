import React from 'react';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Welcome to CMD-Notes</h2>
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
          Select a command from the sidebar or create a new one to get started.
        </p>
      </div>
    </Layout>
  );
}

export default App;
