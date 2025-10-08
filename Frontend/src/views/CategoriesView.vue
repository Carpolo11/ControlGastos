<template>
  <div class="categories-view">
    <NavBar />
    
    <div class="categories-container">
      <div class="categories-header">
        <h1>🏷️ Gestión de Categorías</h1>
        <button @click="openCreateModal" class="btn btn-primary">
          + Nueva Categoría
        </button>
      </div>

      <!-- Tabs para Ingresos y Egresos -->
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ 'active': activeTab === 'Ingreso' }"
          @click="activeTab = 'Ingreso'"
        >
          💰 Ingresos ({{ incomeCategories.length }})
        </button>
        <button 
          class="tab" 
          :class="{ 'active': activeTab === 'Egreso' }"
          @click="activeTab = 'Egreso'"
        >
          💸 Egresos ({{ expenseCategories.length }})
        </button>
      </div>

      <!-- Lista de Categorías de Ingresos -->
      <div v-if="activeTab === 'Ingreso'" class="categories-grid">
        <Card 
          v-for="category in incomeCategories" 
          :key="category.id"
          class="category-card income-category"
          :hover="true"
        >
          <div class="category-content">
            <div class="category-header">
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
            </div>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-stats">
              <span class="stat">
                <strong>{{ category.transactionCount }}</strong> transacciones
              </span>
            </div>
            <div class="category-actions">
              <button @click="editCategory(category)" class="btn-edit">
                Editar
              </button>
              <button @click="deleteCategory(category)" class="btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        </Card>
        
        <div v-if="incomeCategories.length === 0" class="empty-state">
          <p>No hay categorías de ingreso creadas</p>
          <button @click="openCreateModal('Ingreso')" class="btn btn-primary">
            Crear primera categoría de ingreso
          </button>
        </div>
      </div>

      <!-- Lista de Categorías de Egresos -->
      <div v-if="activeTab === 'Egreso'" class="categories-grid">
        <Card 
          v-for="category in expenseCategories" 
          :key="category.id"
          class="category-card expense-category"
          :hover="true"
        >
          <div class="category-content">
            <div class="category-header">
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
            </div>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-stats">
              <span class="stat">
                <strong>{{ category.transactionCount }}</strong> transacciones
              </span>
            </div>
            <div class="category-actions">
              <button @click="editCategory(category)" class="btn-edit">
                Editar
              </button>
              <button @click="deleteCategory(category)" class="btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        </Card>
        
        <div v-if="expenseCategories.length === 0" class="empty-state">
          <p>No hay categorías de egreso creadas</p>
          <button @click="openCreateModal('Egreso')" class="btn btn-primary">
            Crear primera categoría de egreso
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Crear/Editar Categoría -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar' : 'Crear' }} Categoría</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nombre de la Categoría</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="Ej: Alimentación, Salario, etc."
              required
            />
          </div>

          <div class="form-group">
            <label>Tipo</label>
            <select v-model="formData.type" required>
              <option value="Ingreso">💰 Ingreso</option>
              <option value="Egreso">💸 Egreso</option>
            </select>
          </div>

          <div class="form-group">
            <label>Icono (Emoji)</label>
            <input 
              v-model="formData.icon" 
              type="text" 
              placeholder="Ej: 🍕, 💼, 🏠"
              maxlength="2"
            />
          </div>

          <div class="form-group">
            <label>Descripción (Opcional)</label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              placeholder="Descripción de la categoría..."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Guardar Cambios' : 'Crear Categoría' }}
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
  name: 'CategoriesView',
  components: {
    NavBar,
    Card
  },
  data() {
    return {
      activeTab: 'Egreso',
      showModal: false,
      isEditing: false,
      formData: {
        id: null,
        name: '',
        type: 'Egreso',
        icon: '📦',
        description: ''
      },
      incomeCategories: [
        { id: 1, name: 'Salario', type: 'Ingreso', icon: '💼', description: 'Salario mensual', transactionCount: 12 },
        { id: 2, name: 'Bonificaciones', type: 'Ingreso', icon: '🎁', description: 'Bonos y extras', transactionCount: 3 },
        { id: 3, name: 'Inversiones', type: 'Ingreso', icon: '📈', description: 'Rendimientos de inversiones', transactionCount: 5 },
        { id: 4, name: 'Ventas', type: 'Ingreso', icon: '💰', description: 'Ingresos por ventas', transactionCount: 8 }
      ],
      expenseCategories: [
        { id: 5, name: 'Alimentación', type: 'Egreso', icon: '🍕', description: 'Supermercado y restaurantes', transactionCount: 45 },
        { id: 6, name: 'Transporte', type: 'Egreso', icon: '🚗', description: 'Gasolina, taxi, transporte público', transactionCount: 30 },
        { id: 7, name: 'Servicios', type: 'Egreso', icon: '💡', description: 'Luz, agua, internet, teléfono', transactionCount: 20 },
        { id: 8, name: 'Entretenimiento', type: 'Egreso', icon: '🎬', description: 'Cine, streaming, eventos', transactionCount: 15 },
        { id: 9, name: 'Salud', type: 'Egreso', icon: '🏥', description: 'Medicamentos, consultas médicas', transactionCount: 10 },
        { id: 10, name: 'Educación', type: 'Egreso', icon: '📚', description: 'Colegiaturas, cursos, libros', transactionCount: 6 },
        { id: 11, name: 'Vivienda', type: 'Egreso', icon: '🏠', description: 'Arriendo, mantenimiento', transactionCount: 12 }
      ]
    };
  },
  computed: {
    filteredCategories() {
      return this.activeTab === 'Ingreso' ? this.incomeCategories : this.expenseCategories;
    }
  },
  methods: {
    openCreateModal(type = null) {
      this.isEditing = false;
      this.formData = {
        id: null,
        name: '',
        type: type || this.activeTab,
        icon: '📦',
        description: ''
      };
      this.showModal = true;
    },
    editCategory(category) {
      this.isEditing = true;
      this.formData = { ...category };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.formData = {
        id: null,
        name: '',
        type: 'Egreso',
        icon: '📦',
        description: ''
      };
    },
    async saveCategory() {
      // Aquí iría la llamada al backend
      if (this.isEditing) {
        // Actualizar categoría existente
        const index = this.formData.type === 'Ingreso' 
          ? this.incomeCategories.findIndex(c => c.id === this.formData.id)
          : this.expenseCategories.findIndex(c => c.id === this.formData.id);
        
        if (index !== -1) {
          if (this.formData.type === 'Ingreso') {
            this.incomeCategories[index] = { ...this.formData };
          } else {
            this.expenseCategories[index] = { ...this.formData };
          }
        }
      } else {
        // Crear nueva categoría
        const newCategory = {
          ...this.formData,
          id: Date.now(),
          transactionCount: 0
        };
        
        if (this.formData.type === 'Ingreso') {
          this.incomeCategories.push(newCategory);
        } else {
          this.expenseCategories.push(newCategory);
        }
      }
      
      this.closeModal();
    },
    async deleteCategory(category) {
      if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?\nEsto puede afectar las transacciones asociadas.`)) {
        // Aquí iría la llamada al backend
        if (category.type === 'Ingreso') {
          this.incomeCategories = this.incomeCategories.filter(c => c.id !== category.id);
        } else {
          this.expenseCategories = this.expenseCategories.filter(c => c.id !== category.id);
        }
      }
    }
  }
};
</script>

<style scoped>
.categories-view {
  min-height: 100vh;
  background: #f3f4f6;
}

.categories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.categories-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tab {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.tab:hover {
  background: #f3f4f6;
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  transition: all 0.3s;
}

.income-category {
  border-left: 4px solid #10b981;
}

.expense-category {
  border-left: 4px solid #ef4444;
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  font-size: 2.5rem;
}

.category-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.category-description {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.category-stats {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat {
  color: #6b7280;
  font-size: 0.9rem;
}

.stat strong {
  color: #1f2937;
  font-size: 1.1rem;
}

.category-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
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
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
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
  max-width: 550px;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>