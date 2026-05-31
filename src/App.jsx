import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AzanTiming from './pages/AzanTiming';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="azan" element={<AzanTiming />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
