import React, { useEffect, useState } from "react";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(toy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toy),
    })
      .then((response) => response.json())
      .then((savedToy) => {
        setToys((prevToys) => [...prevToys, savedToy]);
      });
  }

  function handleLikeToy(toy) {
    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((prevToys) =>
          prevToys.map((item) =>
            item.id === updatedToy.id ? updatedToy : item
          )
        );
      });
  }

  function handleDonateToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys((prevToys) => prevToys.filter((toy) => toy.id !== id));
    });
  }

  return (
    <>
      <div id="toy-header">
        <img alt="toy header" />
      </div>
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onLike={handleLikeToy}
        onDonate={handleDonateToy}
      />
    </>
  );
}

export default App;
