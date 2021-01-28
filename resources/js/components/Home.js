import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
// import api from 'laravel-mix';

export default function Home() {
    // Ici je vais créer un state pour la valeur de mon input principal
    const [inputValue, setInputValue] = useState("");
    // Ce state est celui de mon table qui contient tous les éléments dont j'ai besoin
    const [liste, setListe] = useState([]);
    // Ici je vais créer un state pour la valeur de mon input dans le bouton edit
    const [inputEdit, setInputEdit] = useState("");

    // useEffect pour avoir l'information avant le rafraîchissement du composant
    useEffect(() => {
        // On fait appel à une route dans le api.php
        axios.get("api/allTodo")
            // S'il trouve bien la route et il réussi à executer le crud, alors il fait une mise à jour du state avec la valeur qu'il reçoit et un console.log du résultat
            .then(res => {
                setListe(res.data);
                console.log(res);
            })
            // S'il y a un problème, alors on reçoit un console.log avec l'erreur
            .catch(err => {
                console.log(err);
            })
    }, []);

    // Le but de cette function est de modifier la valeur de l'input par les éléments qu'on met dans l'input
    let handleChange = e => {
        setInputValue(e.target.value)
    }
    // Le but de cette function est d'ajouter des éléments dans le tableau liste
    let handleSubmit = () => {
        // On crée une variable et le valeur de cette variable est une copie du tableau liste
        let newListe = [...liste];
        // Si l'input est vide, il sort de la function
        if (inputValue === "") {
            return;
        }
        // On crée un objet avec les valeurs qu'on veut
        let task = {
            // Valeur de l'input
            valeur: inputValue,
            // Le validate est false
            validate: 0,
            // Le edit est false
            edit: 0
        }
        // Axios post a besoin de 2 parametres, la route dans le api.php et l'élément qu'on veut créer
        axios.post("api/store", task)
            // S'il trouve la route et il execute le crud, il met à jour tous les states
            .then(res => {
                newListe.push(task);
                setListe(newListe);
                setInputValue("");
                console.log(res);
            })
            // S'il y a un problème, alors on reçoit un console.log avec l'erreur
            .catch(err => {
                console.log(err);
            })

    }
    // Le but de cette function est de changer entre true et false la valeur du validate, pour changer la couleur plus tard
    let handleValidate = i => {
        let listeValidated = [...liste];
        if (listeValidated[i].validate === 0) {
            listeValidated[i].validate = 1
        } else {
            listeValidated[i].validate = 0
        }
        setListe(listeValidated)
    }

    // Le but de cette function est de supprimer un élément précis dans le tableau, c'est pour ça qu'on recupere l'index de l'élément
    let handleDelete = i => {
        // On crée une variable et le valeur de cette variable est une copie du tableau liste
        let listeDeleted = [...liste];
        // Axios delete il a besoin de recuperer l'id de l'élément qu'on veut supprimer pour le trouver dans la DB et le supprimer grâce au crud destroy
        axios.delete(`api/delete/${listeDeleted[i].id}`)
            // S'il le trouve, il supprime l'élèment dans le tableau et il met à jour le state
            .then(res => {
                listeDeleted.splice(i, 1);
                setListe(listeDeleted);
                console.log(res);
            })
            // S'il y a un problème, alors on reçoit un console.log avec l'erreur
            .catch(err => {
                console.log(err);
            })

    }
    // Le but de cette function est de modifier la valeur de l'input qu'il apparait quand on appui sur le bouton edit par les éléments qu'on met dans l'input
    let handleChangeEdit = e => {
        setInputEdit(e.target.value)
    }
    // Le but de cette function est de modifier un élément précis dans le tableau
    let handleEdit = i => {
        // On crée une variable et le valeur de cette variable est une copie du tableau liste
        let editValue = [...liste];
        // Une condition pour changer la valeur du edit entre true et false
        if (editValue[i].edit === 0) {
            editValue[i].edit = 1
        } else {
            editValue[i].valeur = inputEdit
            editValue[i].edit = 0
        }
        // Axios Put fonctionne comme Axios Créate, il a deux parametres, le premier c'est la route avec l'id de l'élèment, et l'autre c'est la nouvelle valeur
        axios.put(`api/edit/${editValue[i].id}`, editValue[i])
            // S'il le trouve, il met à jour le state
            .then(res => {
                setListe(editValue)
                console.log(res);
            })
            // S'il y a un problème, alors on reçoit un console.log avec l'erreur
            .catch(err => {
                console.log(err);
            })
    }



    return (
        <div className="container">
            <h2 className="text-center my-4">Todo List</h2>
            <div className="d-flex align-items-center">
                <input value={inputValue} onChange={handleChange} className="w-85 py-2 input px-3" type="text" />
                <button onClick={handleSubmit} className="btn btn-primary w-15 py-2">Add</button>
            </div>
            <ul className="list-group">
                {liste.map((e, i) => {
                    if (e.edit === 0) {
                        return (
                            <li key={i} className={`my-2 p-1 list-group-item d-flex justify-content-between align-items-center ${e.validate === 1 ? "bg-success text-white" : "bg-light"}`}>
                                {e.valeur}
                                <div className="buttons">
                                    <button onClick={() => handleValidate(i)} className="btn btn-success mx-1"><i className="fas fa-check"></i></button>
                                    <button onClick={() => handleEdit(i)} className="btn btn-warning mx-1"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(i)} className="btn btn-danger mx-1"><i className="fas fa-trash-alt"></i></button>
                                </div>
                            </li>
                        )
                    } else {
                        return (
                            <li key={i} className={`my-2 p-1 list-group-item d-flex justify-content-between align-items-center ${e.validate === 1 ? "bg-success text-white" : "bg-light"}`}>
                                <input value={inputEdit} onChange={handleChangeEdit} type="text" />
                                <div className="buttons">
                                    <button onClick={() => handleEdit(i)} className="btn btn-warning mx-1"><i className="fas fa-edit"></i></button>
                                </div>
                            </li>
                        )
                    }
                })}
            </ul>
        </div>
    );
}


if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}
