import config from '../../params/config.js';
import './style.css';

export default function Search({ onChange }) {
    

    function inputEvent(event) {
        onChange(event.target.value);
    }

    function showFilter() {
        let modal = document.querySelector('div.modal');
        modal.classList.add('show');
    }

    function hideFilter() {
        let modal = document.querySelector('div.modal');
        modal.classList.remove('show');
    }

    return (
        <>
        <div className='searchPanel'>
            <label>
                <input onChange={inputEvent} placeholder='Введите поисковый запрос'/>
            </label>

            <button onClick={showFilter}></button>
        </div>

        <div className='modal'>
            <div className='modal-head'>Фильтр <button onClick={hideFilter}></button></div>
        </div>

        </>
    )
}