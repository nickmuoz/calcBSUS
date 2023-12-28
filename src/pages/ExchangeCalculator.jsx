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
        console.log(exchangeRateBSToCOP)
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const convertUSDToBS = (amount) => {
    return amount * exchangeRateUSDToBS;
  };

  const convertBSToUSD = (amount) => {
    return amount / exchangeRateUSDToBS;
  };

  const convertCOPToUSD = (amount) => {
    return amount / exchangeRateCOPToUSD;
  };

  const convertUSDToCOP = (amount) => {
    return amount * exchangeRateCOPToUSD;
  };

  const convertCOPToBS = (amount) => {
    return amount / exchangeRateBSToCOP;
  };

  const convertBSToCOP = (amount) => {
    return amount * exchangeRateBSToCOP;
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
    switch (`${currencyFrom}_${currencyTo}`) {
      case 'USD_BS':
        convertedAmount = convertUSDToBS(inputAmount);
        break;
      case 'BS_USD':
        convertedAmount = convertBSToUSD(inputAmount);
        break;
      case 'COP_USD':
        convertedAmount = convertCOPToUSD(inputAmount);
        break;
      case 'USD_COP':
        convertedAmount = convertUSDToCOP(inputAmount);
        break;
      case 'COP_BS':
        convertedAmount = convertCOPToBS(inputAmount);
        break;
      case 'BS_COP':
        convertedAmount = convertBSToCOP(inputAmount);
        break;
      default:
        setResult('Invalid conversion.');
        return;
    }

    setResult(`${amount} ${currencyFrom} = ${convertedAmount.toFixed(3)} ${currencyTo}`);
  };

  return (
    <div>
      <nav>
        <h2>Calculadora para cambio de Monedas</h2>
      </nav>
      <main>
        <div>
          <label>
            Cantidad: {''}
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
        </div>
      <br />
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
      <br/>
      <br/>
      <footer >
      <div>
        <a href="https://www.facebook.com/nicolas.m.salcedo.9">
          <image src={Icono2} alt="facebook" />
        </a>
        <a href="https://www.instagram.com/nickmuoz/">
          <image src={Icono} alt="instagram" />
        </a>
        <a href="https://www.linkedin.com/in/nicolas-munoz-salcedo/">
            <image src={Icono3} alt="linkedin" />
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
