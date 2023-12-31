import React, { useState, useEffect } from 'react';
import Icono from "../assets/img/icoinstagram.svg";
import Icono2 from "../assets/img/icofacebook.svg";
import Icono3 from '../assets/img/icolinkedin.svg';

const ExchangeCalculator = () => {
  const [amount, setAmount] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('BS');
  const [exchangeRateUSDToBS, setExchangeRateUSDToBS] = useState(null);
  const [exchangeRateCOPToUSD, setExchangeRateCOPToUSD] = useState(null);
  const [exchangeRateBSToCOP, setExchangeRateBStoCOP] = useState(null);
  const [result, setResult] = useState('');
  const [exchangerateType, setExchangeRate] = useState({
    exchangeRatetype: 'OFICIAL'
  });
  const [manualExchangeRate, setManualExchangeRate] = useState('');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const responseUSDToBS = await fetch('https://apicalculadora.fly.dev/exchange/usd-bs');
        const dataUSDToBS = await responseUSDToBS.json();
        setExchangeRateUSDToBS(dataUSDToBS.USDTOBOLIVAR);

        const responseCOPToUSD = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const dataCOPToUSD = await responseCOPToUSD.json();
        setExchangeRateCOPToUSD(dataCOPToUSD.rates.COP);

        const responseCOPToBS = await fetch('https://api.exchangerate-api.com/v4/latest/VES');
        const dataCOPToBS = await responseCOPToBS.json();
        setExchangeRateBStoCOP(dataCOPToBS.rates.COP);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleExchangeRateTypeChange = (event) => {
    setExchangeRate({
      exchangeRatetype: event.target.value
    });
  };

  const handleManualExchangeRateChange = (event) => {
    setManualExchangeRate(event.target.value);
  };

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

    let convertedAmount;
    let exchangeRate;

    if (exchangerateType.exchangeRatetype === 'MANUAL') {
      exchangeRate = parseFloat(manualExchangeRate);
    } else {
      switch (currencyFrom) {
        case 'USD':
          exchangeRate = currencyTo === 'BS' ? exchangeRateUSDToBS : exchangeRateCOPToUSD;
          break;
        case 'COP':
          exchangeRate = currencyTo === 'USD' ? 1 / exchangeRateCOPToUSD : 1 / exchangeRateBStoCOP;
          break;
        case 'BS':
          exchangeRate = currencyTo === 'USD' ? 1 / exchangeRateUSDToBS : exchangeRateBStoCOP;
          break;
        default:
          setResult('Invalid currency selection.');
          return;
      }
    }

    switch (`${currencyFrom}_${currencyTo}`) {
      case 'USD_BS':
        convertedAmount = inputAmount * exchangeRate;
        break;
      case 'BS_USD':
        convertedAmount = inputAmount / exchangeRate;
        break;
      case 'COP_USD':
        convertedAmount = inputAmount / exchangeRate;
        break;
      case 'USD_COP':
        convertedAmount = inputAmount * exchangeRate;
        break;
      case 'COP_BS':
        convertedAmount = inputAmount / exchangeRate;
        break;
      case 'BS_COP':
        convertedAmount = inputAmount * exchangeRate;
        break;
      default:
        setResult('Invalid conversion.');
        return;
    }

    setResult(`${inputAmount} ${currencyFrom} = ${convertedAmount.toFixed(3)} ${currencyTo}`);
  };

  return (
    <div>
      <nav>
        <h2>Calculadora para cambio de Monedas</h2>
      </nav>
      <main>
        <div>
          <label>
            Seleccione Tipo de Tasa de Cambio:
          </label>
          <div>
            <label>
              <input
                type="radio"
                value="OFICIAL"
                checked={exchangerateType.exchangeRatetype === 'OFICIAL'}
                onChange={handleExchangeRateTypeChange}
              />
              Oficial
            </label>
            <label>
              <input
                type="radio"
                value="MANUAL"
                checked={exchangerateType.exchangeRatetype === 'MANUAL'}
                onChange={handleExchangeRateTypeChange}
              />
              Manual
            </label>
          </div>
        </div>
        {exchangerateType.exchangeRatetype === 'MANUAL' ? (
          <div>
            <label>
              Tasa de Cambio Manual: {''}
              <input
                type="number"
                value={manualExchangeRate}
                onChange={handleManualExchangeRateChange}
              />
            </label>
          </div>
        ) : (
          <></>
        )}
        <div>
          <label>
            De: {''}
            <select value={currencyFrom} onChange={handleCurrencyFromChange}>
              <option value="USD">USD</option>
              <option value="COP">COP</option>
              <option value="BS">BS</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Cantidad: {''}
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
        </div>
        <br />
        <div>
          <label>
            A: {''}
            <select value={currencyTo} onChange={handleCurrencyToChange}>
              <option value="BS">BS</option>
              <option value="USD">USD</option>
              <option value="COP">COP</option>
            </select>
          </label>
        </div>
        <button className="btn-primary" onClick={handleConvert}>
          Convertir
        </button>
        {result && <div>{result}</div>}
      </main>
      <br />
      <br />
      <footer>
        <div>
          <a href="https://www.facebook.com/nicolas.m.salcedo.9">
            <img src={Icono2} alt="facebook" />
          </a>
          <a href="https://www.instagram.com/nickmuoz/">
            <img src={Icono} alt="instagram" />
          </a>
          <a href="https://www.linkedin.com/in/nicolas-munoz-salcedo/">
            <img src={Icono3} alt="linkedin" />
          </a>
        </div>
        <span>
          Hecho con &#128151; por<a href="https://nicolasmuozapp.netlify.app/"> Nicolas Muñoz</a>
        </span>
      </footer>
    </div>
  );
};

export default ExchangeCalculator;
