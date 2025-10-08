<template>
  <div class="family-view">
    <NavBar />
    
    <div class="family-container">
      <div class="family-header">
        <h1>👨‍👩‍👧‍👦 Gestión de Familia</h1>
        <button @click="showCreateModal = true" class="btn btn-primary">
          + Crear Nueva Familia
        </button>
      </div>

      <!-- Lista de Familias del Usuario -->
      <Card title="Mis Familias">
        <div v-if="families.length > 0" class="families-grid">
          <div 
            v-for="family in families" 
            :key="family.id"
            class="family-card"
            :class="{ 'active': family.id === currentFamilyId }"
            @click="selectFamily(family)"
          >
            <div class="family-card-header">
              <h3>{{ family.name }}</h3>
              <span class="role-badge" :class="family.role.toLowerCase()">
                {{ family.role }}
              </span>
            </div>
            <p class="family-members">{{ family.members }} miembros</p>
            <div class="family-actions">
              <button 
                v-if="family.role === 'Administrador'" 
                @click.stop="manageFamily(family)"
                class="btn-action"
              >
                Gestionar
              </button>
              <button 
                v-if="family.id === currentFamilyId"
                class="btn-active"
              >
                ✓ Activa
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No perteneces a ninguna familia aún</p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            Crear mi primera familia
          </button>
        </div>
      </Card>

      <!-- Panel de Gestión de Miembros (solo para administradores) -->
      <Card 
        v-if="selectedFamily && selectedFamily.role === 'Administrador'" 
        title="Miembros de la Familia"
        class="members-card"
      >
        <template #actions>
          <button @click="showAddMemberModal = true" class="btn btn-secondary">
            + Agregar Miembro
          </button>
        </template>

        <div class="members-list">
          <div 
            v-for="member in familyMembers" 
            :key="member.id"
            class="member-item"
          >
            <div class="member-info">
              <div class="member-avatar">{{ member.name.charAt(0) }}</div>
              <div>
                <h4>{{ member.name }}</h4>
                <p>{{ member.email }}</p>
              </div>
            </div>
            <div class="member-actions">
              <span class="role-badge" :class="member.role.toLowerCase()">
                {{ member.role }}
              </span>
              <button 
                v-if="member.role !== 'Administrador'"
                @click="removeMember(member)"
                class="btn-remove"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Modal: Crear Familia -->
    <div v-if="showCreateModal" class="modal" @click.self="showCreateModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Crear Nueva Familia</h2>
          <button @click="showCreateModal = false" class="btn-close">×</button>
        </div>
        <form @submit.prevent="createFamily">
          <div class="form-group">
            <label>Nombre de la Familia</label>
            <input 
              v-model="newFamily.name" 
              type="text" 
              placeholder="Ej: Familia García"
              required
            />
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Crear Familia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Agregar Miembro -->
    <div v-if="showAddMemberModal" class="modal" @click.self="showAddMemberModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Agregar Miembro</h2>
          <button @click="showAddMemberModal = false" class="btn-close">×</button>
        </div>
        <form @submit.prevent="addMember">
          <div class="form-group">
            <label>Correo Electrónico del Usuario</label>
            <input 
              v-model="newMember.email" 
              type="email" 
              placeholder="usuario@email.com"
              required
            />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="newMember.role" required>
              <option value="Miembro">Miembro</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showAddMemberModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Card from '../components/Card.vue';

export default {
  name: 'FamilyView',
  components: {
    NavBar,
    Card
  },
  data() {
    return {
      families: [
        { id: 1, name: 'Familia García', members: 4, role: 'Administrador' },
        { id: 2, name: 'Casa de Playa', members: 2, role: 'Miembro' }
      ],
      familyMembers: [
        { id: 1, name: 'Carlos García', email: 'carlos@email.com', role: 'Administrador' },
        { id: 2, name: 'María García', email: 'maria@email.com', role: 'Miembro' },
        { id: 3, name: 'Juan García', email: 'juan@email.com', role: 'Miembro' },
        { id: 4, name: 'Ana García', email: 'ana@email.com', role: 'Miembro' }
      ],
      currentFamilyId: 1,
      selectedFamily: null,
      showCreateModal: false,
      showAddMemberModal: false,
      newFamily: {
        name: ''
      },
      newMember: {
        email: '',
        role: 'Miembro'
      }
    };
  },
  mounted() {
    this.selectedFamily = this.families[0];
  },
  methods: {
    selectFamily(family) {
      this.currentFamilyId = family.id;
      this.selectedFamily = family;
      localStorage.setItem('currentFamily', JSON.stringify(family));
      // Aquí se recargarían los datos del dashboard
    },
    manageFamily(family) {
      this.selectedFamily = family;
      // Cargar miembros de la familia
    },
    async createFamily() {
      // Llamada al backend para crear familia
      console.log('Crear familia:', this.newFamily);
      
      // Simulación
      const newFam = {
        id: Date.now(),
        name: this.newFamily.name,
        members: 1,
        role: 'Administrador'
      };
      this.families.push(newFam);
      this.showCreateModal = false;
      this.newFamily.name = '';
    },
    async addMember() {
      // Llamada al backend para agregar miembro
      console.log('Agregar miembro:', this.newMember);
      
      // Simulación
      this.familyMembers.push({
        id: Date.now(),
        name: 'Nuevo Usuario',
        email: this.newMember.email,
        role: this.newMember.role
      });
      this.showAddMemberModal = false;
      this.newMember = { email: '', role: 'Miembro' };
    },
    async removeMember(member) {
      if (confirm(`¿Eliminar a ${member.name} de la familia?`)) {
        // Llamada al backend
        this.familyMembers = this.familyMembers.filter(m => m.id !== member.id);
      }
    }
  }
};
</script>

<style scoped>
.family-view {
  min-height: 100vh;
  background: #f3f4f6;
}

.family-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.family-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.family-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
}

.families-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.family-card {
  padding: 1.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.family-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.family-card.active {
  border-color: #667eea;
  background: #ede9fe;
}

.family-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.family-card-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.administrador {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.miembro {
  background: #e0e7ff;
  color: #4338ca;
}

.family-members {
  color: #6b7280;
  margin: 0.5rem 0 1rem 0;
}

.family-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action, .btn-active {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-action {
  background: #667eea;
  color: white;
}

.btn-active {
  background: #10b981;
  color: white;
  cursor: default;
}

.members-card {
  margin-top: 2rem;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.member-info h4 {
  margin: 0;
  color: #1f2937;
}

.member-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-remove {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}

.modal-content form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>