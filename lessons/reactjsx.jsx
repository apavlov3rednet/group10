const element = <h1>Привет, мир!</h1>;

////

const name = 'Mary';
const el = <h1>Привет, {name}!</h1>; // Привет, Mary!

////

function fullName(user) {
    return user.name + ' ' + user.last
}

const user = {
    name: 'Mary',
    last: 'Biden'
}

const userName = (
    <h1>
        Привет, {fullName(user)}
    </h1>
);

////

function generateUserGreeting(user) {
    if(user) {
        return <h1>Привет, {fullName(user)}!</h1>
    }
    else {
        return <h1>Привет, незнакомец!</h1>
    }
}