import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  persons,
  setPersons,
  setMessage,
}) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        number:{" "}
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();

            if (persons.some((person) => person.name === newName)) {
              setMessage(`${newName} is already added to phonebook`);
              return;
            }

            setPersons(persons.concat({ name: newName, number: newNumber }));
            setMessage(`Added ${newName}`);
            setNewName("");
            setNewNumber("");
          }}
        >
          add
        </button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter }) => {
  return (
    <>
      {filter === "" // if filter is empty, show all persons
        ? persons.map((person) => (
            <div key={person.name}>
              {person.name} {person.number}
            </div>
          ))
        : // if filter is not empty, show only persons whose name contains the filter string
          persons
            .filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((person) => (
              <div key={person.name}>
                {person.name} {person.number}
              </div>
            ))}
    </>
  );
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

export default App;
