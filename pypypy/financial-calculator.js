class FinancialCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>
                @import "financial-calculator.css";
            </style>
            // шаблон
            <div>
                <h3>Кредитный калькулятор</h3>
                <div class="form-group">
                    <label>Сумма кредита (руб.):</label>
                    <input type="number" id="amount" min="0" value="1000000">
                </div>
                <div class="form-group">
                    <label>Годовая процентная ставка (%):</label>
                    <input type="number" id="rate" min="0" step="0.1" value="10">
                </div>
                <div class="form-group">
                    <label>Срок кредита (месяцев):</label>
                    <input type="number" id="term" min="1" value="12">
                </div>
                
                <div class="results">
                    <div class="result-item">
                        <span>Ежемесячный платеж:</span>
                        <span class="result-value" id="monthly-payment">0 руб.</span>
                    </div>
                    <div class="result-item">
                        <span>Общая выплата:</span>
                        <span class="result-value" id="total-payment">0 руб.</span>
                    </div>
                    <div class="result-item">
                        <span>Переплата по процентам:</span>
                        <span class="result-value" id="total-interest">0 руб.</span>
                    </div>
                </div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['amount', 'rate', 'term'];
    }

    connectedCallback() {
        console.log("FinancialCalculator: Компонент создан.");


        this.inputs = {
            amount: this.shadowRoot.getElementById('amount'),
            rate: this.shadowRoot.getElementById('rate'),
            term: this.shadowRoot.getElementById('term')
        };

        this.outputs = {
            monthly: this.shadowRoot.getElementById('monthly-payment'),
            total: this.shadowRoot.getElementById('total-payment'),
            interest: this.shadowRoot.getElementById('total-interest')
        };

        // Заполняем значениями
        Object.keys(this.inputs).forEach(key => {
            if (this.hasAttribute(key)) this.inputs[key].value = this.getAttribute(key);
            // Слушаем событие ввода на каждом инпуте
            this.inputs[key].addEventListener('input', () => this.calculate());
        });

        this.calculate();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.inputs?.[name]) {
            console.log(`FinancialCalculator: Атрибут ${name} изменен на "${newValue}".`);
            this.inputs[name].value = newValue;
            this.calculate();
        }
    }

    disconnectedCallback() {
        console.log("FinancialCalculator: Компонент удален.");
    }

    calculate() {
        const p = parseFloat(this.inputs.amount.value);
        const r = parseFloat(this.inputs.rate.value) / 100 / 12;
        const n = parseInt(this.inputs.term.value, 10);

        // Проверка на валидность
        if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || n <= 0) {
            this.outputs.monthly.textContent = 'Ошибка ввода';
            this.outputs.total.textContent = '-';
            this.outputs.interest.textContent = '-';
            return;
        }

        // матан
        const monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = monthly * n;
        const interest = total - p;

        // Вывод результатов
        this.outputs.monthly.textContent = `${monthly.toFixed(2)} руб.`;
        this.outputs.total.textContent = `${total.toFixed(2)} руб.`;
        this.outputs.interest.textContent = `${interest.toFixed(2)} руб.`;
    }
}

customElements.define('financial-calculator', FinancialCalculator);