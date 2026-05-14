import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(toyData) {
    const toyToCreate = { ...toyData, likes: 0 };

    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toyToCreate),
    })
      .then((response) => response.json())
      .then((newToy) => {
        setToys((prevToys) => [...prevToys, newToy]);
        setShowForm(false);
      });
  }

  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys((prevToys) => prevToys.filter((toy) => toy.id !== id));
    });
  }

  function handleLikeToy(toy) {
    const updatedToy = { ...toy, likes: toy.likes + 1 };

    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedToy.likes }),
    })
      .then((response) => response.json())
      .then((returnedToy) => {
        setToys((prevToys) =>
          prevToys.map((currentToy) =>
            currentToy.id === returnedToy.id ? returnedToy : currentToy,
          ),
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
