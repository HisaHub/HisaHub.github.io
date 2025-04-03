class HisaHub {
    constructor() {
        this.portfolios = {
            main: {
                previousBalance: 1500000,
                currentBalance: 1523400,
                holdings: {
                    SAF: { shares: 100, avgPrice: 18.50 },
                    KCB: { shares: 50, avgPrice: 25.75 }
                }
            }
        };

        this.initCharts();
        this.initEventListeners();
        this.loadPortfolios();
        this.simulatePriceChanges();
        this.loadNews();
    }

    initCharts() {
        // Performance Chart
        this.performanceChart = new Chart(document.getElementById('performanceChart'), {
            type: 'line',
            data: {
                labels: ['1D', '1W', '1M', '3M', '6M', '1Y'],
                datasets: [{
                    label: 'Portfolio Performance',
                    data: [5, 8, 12, 15, 18, 25],
                    borderColor: '#FFD700',
                    tension: 0.4
                }]
            }
        });

        // Price Chart
        this.priceChart = new Chart(document.getElementById('priceChart'), {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Price',
                    data: this.generatePriceData(),
                    borderColor: '#2ECC71',
                    tension: 0.4
                }]
            }
        });
    }

    initEventListeners() {
        document.querySelectorAll('.order-type').forEach(btn => {
            btn.addEventListener('click', () => this.setOrderType(btn));
        });

        document.querySelector('.buy-btn').addEventListener('click', () => this.executeTrade('buy'));
        document.querySelector('.sell-btn').addEventListener('click', () => this.executeTrade('sell'));
    }

    loadPortfolios() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        Object.entries(this.portfolios).forEach(([name, portfolio]) => {
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.innerHTML = `
                <h3>${name.toUpperCase()} Portfolio</h3>
                <div class="portfolio-value">KES ${portfolio.currentBalance.toLocaleString()}</div>
            `;
            portfolioGrid.appendChild(card);
        });
    }

    executeTrade(type) {
        const quantity = parseInt(document.getElementById('quantity').value);
        if (!quantity || quantity <= 0) return;
        
        const transaction = {
            type,
            quantity,
            timestamp: new Date().toLocaleString(),
            status: 'Pending'
        };

        this.updatePendingOrders();
        this.updateBalances(type, quantity);
    }

    updateBalances(type, quantity) {
        const portfolio = this.portfolios.main;
        const price = type === 'buy' ? 18.50 : 18.45; // Simulated price
        const amount = quantity * price;

        if (type === 'buy') {
            portfolio.currentBalance -= amount;
        } else {
            portfolio.currentBalance += amount;
        }

        this.updateBalanceDisplays();
    }

    updateBalanceDisplays() {
        document.getElementById('previousBalance').textContent = 
            KES ${this.portfolios.main.previousBalance.toLocaleString()};
        
        document.getElementById('liveBalance').textContent = 
            KES ${this.portfolios.main.currentBalance.toLocaleString()};
    }

    simulatePriceChanges() {
        setInterval(() => {
            this.portfolios.main.currentBalance *= 1 + (Math.random() * 0.02 - 0.01);
            this.updateBalanceDisplays();
        }, 3000);
    }

    loadNews() {
        const newsFeed = document.getElementById('newsFeed');
        const newsItems = [
            { stock: 'SAF', content: 'Safaricom announces new mobile trading partnership' },
            { stock: 'KCB', content: 'KCB Bank launches new investor portal' }
        ];

        newsItems.forEach(item => {
            const article = document.createElement('div');
            article.className = 'news-article';
            article.innerHTML = `
                <h4>${item.stock} News</h4>
                <p>${item.content}</p>
            `;
            newsFeed.appendChild(article);
        });
    }

    // Helper methods
    generateTimeLabels() {
        return Array.from({ length: 24 }, (_, i) => ${i}:00);
    }

    generatePriceData() {
        return Array.from({ length: 24 }, () => 
            Math.floor(Math.random() * (25 - 15 + 1)) + 15
        );
    }

    updatePendingOrders() {
        const pending = document.getElementById('pendingOrders');
        pending.textContent = ${parseInt(pending.textContent) + 1} Pending;
    }

    setOrderType(btn) {
        document.querySelectorAll('.order-type').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const hisaHub = new HisaHub();
});