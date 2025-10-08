<template>
  <div id="app">
    <Layout>
      <RouterView />
    </Layout>
  </div>
</template>

<script setup>
import Layout from './components/Layout.vue'
</script>

<style>
/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

#app {
  min-height: 100vh;
}

/* Estilos para las secciones de contenido */
.content-section {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ESTILOS RICK & MORTY */
.characters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.character-card {
  border: none;
  border-radius: 15px;
  padding: 20px;
  background: linear-gradient(145deg, #ff6b6b, #ee5a52);
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  color: white;
}

.character-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 25px rgba(0,0,0,0.4);
}

.character-card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.character-card:hover img {
  transform: rotate(5deg) scale(1.1);
}

.character-card h1 {
  font-size: 1.4em;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Modal genérico */
.modal-backdrop {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  animation: modalSlideIn 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
  font-size: 28px;
  color: #666;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #ff6b6b;
}

#modalImage {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #ff6b6b;
  margin: 10px 0;
}

#modalEpisodes {
  text-align: left;
  max-height: 200px;
  overflow: auto;
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
}

/* ESTILOS FÚTBOL / PERFIL */
.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h2 {
  color: white;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.futbol-tabs, .perfil-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 12px 25px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.futbol-card {
  background: linear-gradient(145deg, #00c851, #007e33);
  border-radius: 15px;
  padding: 25px;
  color: white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.futbol-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 25px rgba(0,0,0,0.4);
}

.futbol-card h3 {
  font-size: 1.5em;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.futbol-card p {
  margin: 8px 0;
  font-size: 0.95em;
}

.futbol-card strong {
  color: #ffeb3b;
}

/* PERFIL */
.perfil-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.perfil-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.info-personal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.perfil-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid #667eea;
  object-fit: cover;
}

.perfil-info h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

.perfil-info p {
  color: #666;
  font-size: 1.1em;
  line-height: 1.6;
}

.perfil-tabs {
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}

.perfil-tabs .tab-btn {
  background: transparent;
  color: #fff;
  border-radius: 0;
  border-bottom: 3px solid transparent;
  margin: 0 5px;
}

.perfil-tabs .tab-btn.active {
  background: transparent;
  border-bottom: 3px solid #667eea;
  color: #333;
}

.perfil-tab-content h3 {
  color: #333;
  font-size: 1.8em;
  margin-bottom: 20px;
  text-align: center;
}

.perfil-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.perfil-item:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transform: translateX(5px);
}

.perfil-item h4 {
  color: #333;
  font-size: 1.3em;
  margin-bottom: 10px;
}

.perfil-item p {
  color: #666;
  line-height: 1.6;
  margin: 5px 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.skill-category {
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.skill-category h5 {
  font-size: 1.2em;
  margin-bottom: 15px;
  text-align: center;
}

.skill-list {
  list-style: none;
}

.skill-list li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

/* Animaciones */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .characters-container,
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .futbol-tabs,
  .perfil-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .info-personal {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 600px) {
  .characters-container,
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-card {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
}
</style>