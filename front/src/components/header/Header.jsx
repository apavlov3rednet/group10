import { useCallback, useEffect, useState } from 'react';
import Logo from '../../images/logo.png';
import './style.css';
import Menu from '../menu/Menu';

export default function Header({ ...props }) {
    /**
     * Правила работы с хуками
     * 1. Нельзя писать вне компонента
     * 2. useState и useEffect всегда должны быть на самом верхнем уровне 
     * (нельзя вкладывать в условия)
     * и в самом начале компонента
     */
    //const [now, setNow] = useState(new Date());

    return (
        <header>
            <div className='LogoGroup'>
            <img src={Logo} width="30px" alt='' />
            <h1>SPA</h1>
            </div>
            
            <Menu />

            {/* <div className='timer'>Время: { now.toLocaleTimeString() }</div> */}
        </header>
    )
}