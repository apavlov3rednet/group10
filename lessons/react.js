//npx create-react-app ./front
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMClient = require('react-dom/client');

//low level
const hi = <h1 className='' dataName=''>Привет мир</h1>; //base jsx, camelCase -нижний, CamelCase - верхний

ReactDOM.render(hi, document.getElementById('root'));
ReactDOM.render(<h1>Привет мир</h1>);

//Без JSX
ReactDOM.render(React.createElement('input', {
    placeholder: '',
    type: '',
    onClick: () => console.log('click') // onclick
}), document.getElementById('root'));

const onClickInput = () => console.log('click');

ReactDOM.render(<input type='' placeholder='' onClick={onClickInput}/>, document.getElementById('root'));

//require level

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render();

//low
const Logo = () => {
    return (
        <img src='./public/images/logo.png'/>
    )
}

root.render(<Logo />);

class Header extends React.Component {
    headerText = 'SPA Application';

    render(response) {
        return (
            <header>
                <Logo />
                <h1>{this.headerText}</h1>

                <menu>
                    {response.link.map(item=>{
                        if(item.selected) {
                            <li className='selected'>{item.name}</li>
                        }
                        else {
                            <li>{item.name}</li>
                        }
                    })}
                </menu>
            </header>
        );
    }
}

root.render(<Header />);