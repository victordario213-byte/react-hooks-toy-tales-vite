# Practice Challenge: Toy Tales

You've got a friend in need! Again!

Andy has misplaced of his toys (again) and need your help to organize them.

## Setup

All the information about Andy's toys can be found in the `db.json` file. We'll
be using `json-server` to create a RESTful API for our database.

Run `npm install` to install our dependencies.

Then, run `npm run server` to start up `json-server` on `http://localhost:3001`.

In another tab, run `npm run dev` to start up our React app at `http://localhost:3000`.

In another tab, run `npm run test` to run the test suite.

Before you start building out the application, the first step that you should
take is to examint the current code and component hierarchy. This will tell you
how components can pass data to each other as well as where that information should
be stored.

## Deliverables

- _When our application loads_, make a GET request to `/toys` to fetch the toy
  array. Given your component tree, think about which component should be
  responsible for the array. After you have put the data in the proper
  component, your next job is to render the `ToyCard` components on the page.

- _When the `ToyForm` is submitted_, make a POST request to `/toys` to save a
  new toy to the server. Using the ideas of controlled form and inverse data
  flow, think about how to render a new `ToyCard` for the toy that you created.

- _When the `Donate to Goodwill` button is clicked_, make a DELETE request to
  `/toys/:id` with the ID of the toy that was clicked to delete the toy from the
  server. The `ToyCard` that you clicked on should also be removed from the DOM.

- _When the like button is clicked_, make a PATCH request to `/toys/:id` with
  the id of the toy that was clicked, along with the new number of likes (this
  should be sent in the body of the PATCH request, as a object:
  `{ likes: 10 }`), to update the toy on the server. Clicking on the button
  should also increase the number of likes on the DOM.

## Implementation Details

### Full CRUD Operations Completed

#### GET - Fetch All Toys

In `App.jsx`, a `useEffect` hook fetches all toys from the backend on component mount:

```jsx
useEffect(() => {
  fetch("http://localhost:3001/toys")
    .then((response) => response.json())
    .then((data) => setToys(data));
}, []);
```

Toys are stored in state and passed to `ToyContainer` for rendering.

#### POST - Create New Toy

The `handleAddToy` function creates a new toy (with 0 likes) and sends it to the backend:

```jsx
function handleAddToy(toyData) {
  const toyToCreate = { ...toyData, likes: 0 };

  fetch("http://localhost:3001/toys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toyToCreate),
  })
    .then((response) => response.json())
    .then((newToy) => {
      setToys((prevToys) => [...prevToys, newToy]);
      setShowForm(false);
    });
}
```

The new toy is added to state and rendered immediately.

#### DELETE - Remove Toy

The `handleDeleteToy` function removes a toy from the server and updates state:

```jsx
function handleDeleteToy(id) {
  fetch(`http://localhost:3001/toys/${id}`, {
    method: "DELETE",
  }).then(() => {
    setToys((prevToys) => prevToys.filter((toy) => toy.id !== id));
  });
}
```

The toy is removed from the DOM by filtering state.

#### PATCH - Update Likes

The `handleLikeToy` function increments likes and updates the toy on the server:

```jsx
function handleLikeToy(toy) {
  const updatedToy = { ...toy, likes: toy.likes + 1 };

  fetch(`http://localhost:3001/toys/${toy.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
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
```

State is updated using `.map()` to preserve toy order while updating the specific toy.

### Component Architecture

- **App.jsx**: Manages toy state and CRUD handlers
- **ToyContainer.jsx**: Maps toys array to ToyCard components
- **ToyCard.jsx**: Displays toy with like/donate buttons
- **ToyForm.jsx**: Controlled form for creating new toys

### Test Results

✅ All 5 tests passing:

- Displays all toys on startup
- Toys aren't hardcoded
- Removes toy when donate button clicked
- Increments likes when like button clicked
- Submits new toy and displays it
