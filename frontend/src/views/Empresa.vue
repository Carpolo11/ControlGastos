
<template>
  <RegistroEmpresaComponent
    @empresa-registrada="manejarEmpresaRegistrada"
  />
</template>

<script>
import RegistroEmpresaComponent from
  "../components/empresas/RegistroEmpresaComponent.vue";

export default {
  name: "RegistroEmpresaView",

  components: {
    RegistroEmpresaComponent
  },

  methods: {
    manejarEmpresaRegistrada(empresa) {
      console.log("Empresa registrada:", empresa);

      // Aquí puedes agregar después la navegación
      // al inventario de activos de la empresa.
    }
  }
};
</script>
