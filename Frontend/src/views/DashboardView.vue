<template>
  <div class="dashboard">
    <NavBar />
    
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Resumen financiero de tu familia</p>
      </div>

      <!-- Balance General -->
      <div class="balance-cards">
        <Card class="balance-card income-card">
          <div class="balance-content">
            <div class="balance-icon">💰</div>
            <div class="balance-info">
              <span class="balance-label">Total Ingresos</span>
              <h2 class="balance-amount">${{ formatNumber(totalIncome) }}</h2>
            </div>
          </div>
        </Card>

        <Card class="balance-card expense-card">
          <div class="balance-content">
            <div class="balance-icon">💸</div>
            <div class="balance-info">
              <span class="balance-label">Total Egresos</span>
              <h2 class="balance-amount">${{ formatNumber(totalExpense) }}</h2>
            </div>
          </div>
        </Card>

        <Card class="balance-card total-card">
          <div class="balance-content">
            <div class="balance-icon">💵</div>
            <div class="balance-info">
              <span class="balance-label">Saldo</span>
              <h2 class="balance-amount" :class="{ 'negative': balance < 0 }">
                ${{ formatNumber(balance) }}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <!-- Últimas Transacciones -->
      <div class="dashboard-grid">
        <Card title="Últimas Transacciones" class="transactions-card">
          <template #actions>
            <router-link to="/transactions" class="link-action">Ver todas →</router-link>
          </template>
          
          <div v-if="recentTransactions.length > 0" class="transactions-list">
            <div 
              v-for="transaction in recentTransactions" 
              :key="transaction.id" 
              class="transaction-item"
            >
              <div class="transaction-info">
                <span class="transaction-category">{{ transaction.category }}</span>
                <span class="transaction-date">{{ transaction.date }}</span>
              </div>
              <span 
                class="transaction-amount"
                :class="transaction.type === 'Ingreso' ? 'income' : 'expense'"
              >
                {{ transaction.type === 'Ingreso' ? '+' : '-' }}${{ formatNumber(transaction.amount) }}
              </span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay transacciones registradas</p>
            <router-link to="/transactions" class="btn btn-primary">
              Registrar primera transacción
            </router-link>
          </div>
        </Card>

        <!-- Gráfico de Gastos por Categoría -->
        <Card title="Gastos por Categoría" class="chart-card">
          <div class="chart-placeholder">
            <div v-if="expensesByCategory.length > 0" class="category-bars">
              <div 
                v-for="item in expensesByCategory" 
                :key="item.category"
                class="category-bar-item"
              >
                <div class="category-info">
                  <span>{{ item.category }}</span>
                  <span class="category-amount">${{ formatNumber(item.amount) }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: (item.amount / totalExpense * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No hay datos de gastos</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Card from '../components/Card.vue';

export default {
  name: 'DashboardView',
  components: {
    NavBar,
    Card
  },
  data() {
    return {
      totalIncome: 5000000,
      totalExpense: 3200000,
      recentTransactions: [
        { id: 1, category: 'Alimentación', amount: 150000, date: '2025-10-08', type: 'Egreso' },
        { id: 2, category: 'Salario', amount: 2500000, date: '2025-10-05', type: 'Ingreso' },
        { id: 3, category: 'Transporte', amount: 80000, date: '2025-10-04', type: 'Egreso' },
        { id: 4, category: 'Servicios', amount: 200000, date: '2025-10-02', type: 'Egreso' },
        { id: 5, category: 'Entretenimiento', amount: 120000, date: '2025-10-01', type: 'Egreso' }
      ],
      expensesByCategory: [
        { category: 'Alimentación', amount: 800000 },
        { category: 'Transporte', amount: 450000 },
        { category: 'Servicios', amount: 600000 },
        { category: 'Entretenimiento', amount: 350000 },
        { category: 'Salud', amount: 500000 },
        { category: 'Otros', amount: 500000 }
      ]
    };
  },
  computed: {
    balance() {
      return this.totalIncome - this.totalExpense;
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('es-CO').format(num);
    }
  },
  mounted() {
    // Aquí se cargarían los datos reales desde el backend
    // this.loadDashboardData();
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f3f4f6;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 0;
  color: #6b7280;
}

.balance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.balance-card {
  background: white;
}

.income-card {
  border-top: 4px solid #10b981;
}

.expense-card {
  border-top: 4px solid #ef4444;
}

.total-card {
  border-top: 4px solid #3b82f6;
}

.balance-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.balance-icon {
  font-size: 3rem;
}

.balance-info {
  flex: 1;
}

.balance-label {
  display: block;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.balance-amount {
  margin: 0;
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
}

.balance-amount.negative {
  color: #ef4444;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.link-action {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.link-action:hover {
  text-decoration: underline;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transaction-category {
  font-weight: 600;
  color: #1f2937;
}

.transaction-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.transaction-amount {
  font-weight: 700;
  font-size: 1.1rem;
}

.transaction-amount.income {
  color: #10b981;
}

.transaction-amount.expense {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state p {
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.category-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.category-amount {
  font-weight: 600;
  color: #667eea;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}
</style>