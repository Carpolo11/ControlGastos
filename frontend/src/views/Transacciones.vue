<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-title class="app-title">💰 Transacciones</ion-title>

      <!-- Formulario de nueva transacción -->
      <form @submit.prevent="crearTransaccion" class="formulario">
        <ion-item>
          <ion-label position="floating">Fecha</ion-label>
          <ion-input type="date" v-model="fecha" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Monto</ion-label>
          <ion-input type="number" v-model="monto" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Tipo</ion-label>
          <ion-select v-model="tipo" placeholder="Selecciona tipo" required>
            <ion-select-option value="Ingreso">Ingreso</ion-select-option>
            <ion-select-option value="Egreso">Egreso</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Categoría</ion-label>
          <ion-input v-model="idcategoria" placeholder="ID de categoría" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Descripción</ion-label>
          <ion-input v-model="descripcion" placeholder="Descripción"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" color="success">Guardar</ion-button>
      </form>

      <ion-list>
        <ion-list-header>📋 Historial de Transacciones</ion-list-header>
        <ion-item v-for="(t, index) in transacciones" :key="index">
          <ion-label>
            <h2>{{ t.descripcion }}</h2>
            <p>{{ t.fecha }} — {{ t.tipo }} — {{ t.nombre_categoria }}</p>
            <strong>${{ t.monto }}</strong>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import axios from "axios";

export default {
  name: "Transacciones",
  data() {
    return {
      transacciones: [],
      id_familia: null,
      idcategoria: "",
      fecha: "",
      tipo: "",
      monto: "",
      descripcion: "",
      identificacion: ""
    };
  },
  async mounted() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (usuario) {
      this.id_familia = usuario.id_familia;
      this.identificacion = usuario.identificacion;
      await this.cargarTransacciones();
    } else {
      console.warn("⚠️ No hay usuario logueado.");
    }
  },
  methods: {
    async cargarTransacciones() {
      try {
        const res = await axios.get(`http://localhost:3000/api/transacciones?id_familia=${this.id_familia}`);
        this.transacciones = res.data;
      } catch (error) {
        console.error("❌ Error al cargar transacciones:", error);
      }
    },
    async crearTransaccion() {
      try {
        const nueva = {
          id_familia: this.id_familia,
          idcategoria: this.idcategoria,
          fecha: this.fecha,
          tipo: this.tipo,
          monto: this.monto,
          descripcion: this.descripcion,
          identificacion: this.identificacion
        };

        await axios.post("http://localhost:3000/api/transacciones", nueva);
        await this.cargarTransacciones(); // Recarga la lista
        this.limpiarFormulario();
      } catch (error) {
        console.error("❌ Error al crear transacción:", error);
      }
    },
    limpiarFormulario() {
      this.idcategoria = "";
      this.fecha = "";
      this.tipo = "";
      this.monto = "";
      this.descripcion = "";
    }
  }
};
</script>

<style scoped>
.app-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.formulario {
  margin-bottom: 2rem;
}

ion-list-header {
  font-weight: bold;
  margin-top: 1rem;
}
</style>
