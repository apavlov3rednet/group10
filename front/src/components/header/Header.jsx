import { useEffect, useState } from 'react';
import Logo from '../../images/logo.png';
import './style.css';

export default function Header() {
    /**
     * Правила работы с хуками
     * 1. Нельзя писать вне компонента
     * 2. useState и useEffect всегда должны быть на самом верхнем уровне 
     * (нельзя вкладывать в условия)
     * и в самом начале компонента
     */
    const [now, setNow] = useState(new Date());

    useEffect(
        () => {
            const interval = setInterval(() => setNow(new Date()), 1000);

            return () => {
                clearInterval(interval);
                console.log('clear...');
            }
        }, []
    );

    return (
        <header>
            <div className='LogoGroup'>
            <img src={Logo} width="30px" alt='' />
            <h1>SPA</h1>
            </div>
            
            <menu>
                <li dataRoute="owners">Владельцы</li>
                <li dataRoute="brands">Бренды</li>
                <li dataRoute="models">Модели</li>
                <li dataRoute="services">Услуги</li>
                <li dataRoute="cards">Объекты</li>
            </menu>

            <div className='timer'>Время: { now.toLocaleTimeString() }</div>
        </header>
    )
}