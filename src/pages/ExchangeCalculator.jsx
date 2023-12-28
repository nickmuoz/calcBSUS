import React, { useState, useEffect } from 'react';

const ExchangeCalculator = () => {
  const [amount, setAmount] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('BS');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://apicalculadora.fly.dev/exchange/usd-bs');
        const data = await response.json();
        setExchangeRate(data.USDTOBOLIVAR);
      } catch (error) {
        console.error('Error Opteniendo el cambio:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCurrencyFromChange = (event) => {
    setCurrencyFrom(event.target.value);
  };

  const handleCurrencyToChange = (event) => {
    setCurrencyTo(event.target.value);
  };

  const handleConvert = () => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) {
      setResult('Por Favor Ingrese un Numero Valido.');
      return;
    }

    if (exchangeRate === null) {
      setResult('Trayendo tasa de cambio, por favor espere...');
      return;
    }

    const convertedAmount =
      currencyFrom === 'USD' ? inputAmount * exchangeRate : inputAmount / exchangeRate;

    setResult(`${amount} ${currencyFrom} = ${convertedAmount.toFixed(2)} ${currencyTo}`);
  };

  return (
    <div>
      <h1>Calculadora para cambio de Dolares y Bolivares</h1>
      <div>
        <label>
          Cantidad:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
      </div>
      <div>
        <label>
          De:
          <select value={currencyFrom} onChange={handleCurrencyFromChange}>
            <option value="USD">USD</option>
            <option value="BS">BS</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          A:
          <select value={currencyTo} onChange={handleCurrencyToChange}>
            <option value="USD">USD</option>
            <option value="BS">BS</option>
          </select>
        </label>
      </div>
      <button onClick={handleConvert}>Convertir</button>
      {result && <div>{result}</div>}
    </div>
  );
};

export default ExchangeCalculator;
