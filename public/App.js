import React from "react";

const PORT = 3000;

class Header extends React.Component {
    render() {
        return (
            <header>Шапка сайта</header>
        )
    }
}

class Image extends React.Component {
    render(props) {
        return (
            <img src='./images/logo.png'
            width={(props.width) ? props.width : '40px'}
            onClick={props.event} />
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div className='content'>
                <Header />
                <Image />
                <Image width="60px" />
                <Image onClick={this.clickOnImage} />
                <Image />
                <Image />
            </div>
        )
    }

    clickOnImage() {
        window.reload = '/';
    }
}

export default App;