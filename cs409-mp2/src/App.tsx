import React from 'react';
import styles from './App.module.css'; 
import Navigation from './components/Navigation'; 
import ListView from './pages/listView';
import GalleryView from './pages/galleryView';
import DetailView from './pages/detailView'; 
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'; 



function App() {
  return (
    <BrowserRouter basename='/cs409-mp2'> 
      <div className={styles.appContainer}>
        {/* Navigation bar at the top */}
        <Navigation /> 
        <Routes>
          <Route path='/' element={<Navigate to = '/list' replace />} /> 
          <Route path='/list' element={<ListView />} />  
          <Route path='/gallery' element={<GalleryView />} />
          <Route path='/movie/:id' element={<DetailView />} /> 
        </Routes> 
      </div>
    </BrowserRouter>
  );
}

export default App;
