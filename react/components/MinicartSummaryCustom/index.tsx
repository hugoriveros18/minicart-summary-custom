import React, { useEffect, useState } from "react";
import { useOrderForm } from 'vtex.order-manager/OrderForm';
import { useCssHandles } from 'vtex.css-handles';
import CSS_HANDLES from "../../typings/cssHandles";
import './styles.css';

const MinicartSummaryCustom = () => {

  //ORDER INFORMATION
  const { orderForm } = useOrderForm();

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [subtotal, setSubtotal] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  //EFFECTS
  useEffect(() => {
    let subtotalOrderForm:number = 0;
    let descuentosOrderForm:number = 0;

    orderForm.items.forEach((item:any) => {
      const listPrice = removeLastTwoNumbers(item.listPrice);
      const sellingPrice = removeLastTwoNumbers(item.sellingPrice);
      if(listPrice !== sellingPrice) {
        descuentosOrderForm += ((listPrice - sellingPrice) * item.quantity);
      }
      subtotalOrderForm += listPrice * item.quantity;
    })
    setSubtotal(subtotalOrderForm);
    setDescuentos(descuentosOrderForm);
    setTotal(subtotalOrderForm - descuentosOrderForm);
  },[orderForm])

  //METHODS
  const removeLastTwoNumbers = (number:number): number => {
    const returnValue = `${number}`.slice(0, `${number}`.length - 2);
    return +returnValue
  }

  const currencyNumberFormated = (number: number): string => {
    const numberReversed:string[] = `${number}`.split('').reverse();
    let currencyFormat:string[] = [];
    for(let i = 0; i < numberReversed.length; i++) {
      currencyFormat.unshift(numberReversed[i]);
      if((i + 1) % 3 === 0) {
        if(i !== numberReversed.length - 1) {
          currencyFormat.unshift('.');
        }
      }
    }

    return `$ ${currencyFormat.join('')}`
  }

  //JSX
  return(
    <div className={`${handles['minicart-summary__general-container']}`}>
      <ul className={`${handles['minicart-summary__list-container']}`}>
        <li className={`${handles['minicart-summary__value-box']} ${handles['regular-box']}`}>
          <h3>Subtotal</h3>
          <p>{currencyNumberFormated(subtotal)}</p>
        </li>
        {
          descuentos > 0 &&
          <li className={`${handles['minicart-summary__value-box']} ${handles['regular-box']}`}>
            <h3>Descuentos</h3>
            <p>-{currencyNumberFormated(descuentos)}</p>
          </li>
        }
        <li className={`${handles['minicart-summary__value-box']} ${handles['total-box']}`}>
          <h3>Total</h3>
          <p>{currencyNumberFormated(total)}</p>
        </li>
      </ul>
      <div className={`${handles['minicart-summary__flete-carrito']}`}>
        <p>El costo del envío, no está incluido en el precio</p>
      </div>
    </div>
  )
}

export default MinicartSummaryCustom;
