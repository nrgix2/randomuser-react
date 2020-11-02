import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios";
import {
    BrowserRouter as Router,
        Switch,
        Route,
        Redirect,
        Link
} from "react-router-dom";
import about from "./about";
import About from "./about";

const ButtonPrimary = ({onClick, children}) => (
    <button className="btn btn-primary" onClick={onClick}>{children}</button>
);



const Header = ({onFetchClick, onSortClick}) => (
    <div>
        <Router>
        <h1> <Link to="/" style={{textDecoration: "none", color: "black"}}> React app </Link></h1>
        <ButtonPrimary onClick={onFetchClick}>Fetch users</ButtonPrimary>
        <ButtonPrimary onClick={onSortClick}>Trier l'age par ordre croissant</ButtonPrimary>
        <hr/>
        </Router>
    </div>
);

const Table = ({users}) => (
    <table className="table table-hover">
        <thead>
        <tr>
            <th>Photo</th>
            <th>Prénom - Nom</th>
            <th>Email</th>
            <th>Tel</th>
            <th>Age</th>
            <th>Users Informations</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user => <Row user={user} key={user.id}/>)}
        </tbody>
    </table>
);

const Row = ({user}) => (
    <Router>

        <tr>
            {/* We use the var created in fetchUser and send in Table() function*/}
            <td><img src={user.picture} alt=""/></td>
            <td> {user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.age}</td>
            <td><Link to="/infos" style={{textDecoration: "none", color: "red"}}>More informations</Link></td>

        </tr>

        <Switch>
          
            <Route exact path="/infos">
                <Infos user={user}/>
            </Route>
            <Route path="/about">

                <about />
            </Route>

        </Switch>
    </Router>

);
function Infos ({user}) {
return <div>

    <p>This is a {user.gender}</p>
 <p>  Registered at {user.register}</p>
    <p> City: {user.city} </p>
    <div>
        <Link to="/" style={{textDecoration: "none", color: "black"}}>
        <button className="btn btn-warning">
            Fermer les infos
        </button>
        </Link>
    </div>
</div>




}

const fetchUsers = async (userCount) => {
    try {
        const {data: {results}} = await axios.get('https://randomuser.me/api/?results=' + userCount)

        return results.map(result => ({
            id: result.login.uuid,
            firstName: result.name.first,
            lastName: result.name.last,
            phone: result.phone,
            email: result.email,
            age: result.dob.age,
            picture: result.picture.thumbnail,
            gender: result.gender,
            register: result.registered.date,
            city: result.location.city,
        }))
    } catch (e) {
        console.error(e);
        return []
    }

};

export const App = () => {

    const [users, setUsers] = useState([]);
    const [num, setNum] = useState(0);
    const [search, setSearch] = useState('');

    const handleFetchClick = () => {
        fetchUsers(10).then((newUsers) => setUsers([...users, ...newUsers]));
    };

    const sortUsersOnClick = () => {
        setUsers(users => [...users].sort(function (a, b) {
                const textA = a.age;
                const textB = b.age;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        )
    }

    const filteredUser = users.filter(user => {
        return (
            user.firstName.toLowerCase().includes(search.toLowerCase())
            || user.phone.toLowerCase().includes(search.toLowerCase())
            || String(user.age) === search
            || user.lastName.toLowerCase().includes(search.toLowerCase())
        )
    });


    useEffect(async () => {
            fetchUsers(5).then(users => setUsers(users));
        },
        [num]);


    return (



        <div className="container-fluid">
            <div id="app">
                <Header onFetchClick={handleFetchClick}
                        onSortClick={sortUsersOnClick}/>
                <input type="text" placeholder="Rechercher" onChange={e => setSearch(e.target.value)}/>
                <Table users={filteredUser}/>
            </div>
        </div>

    )
};

