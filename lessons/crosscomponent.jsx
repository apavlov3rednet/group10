import { useState } from "react";

const Parent = () => {
    const [value, setValue] = useState('');

    const handleChange = (value) => { //5
        setValue(value); //6
    }

    return (
        <div>
            <Sibling1 onChange={handleChange} /> //4
            <Sibling2 value={value} /> //7
        </div>
    )
}

const Sibiling1 = ({ onChange }) => {
    const handleChange = (event) => { //2
        onChange(event.target.value); //3
    }

    return (
        <input type='text' onChange={handleChange} /> //1
    )
}

const Sibling2 = ({value}) => {
    return (
        <span>{value}</span> //8 final
    )
}