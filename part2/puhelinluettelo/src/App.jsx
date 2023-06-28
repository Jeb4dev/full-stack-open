import { useState, useEffect } from "react";
import Services from "./Services";
import "./index.css";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ msg: "", cls: "" });

  useEffect(() => {
    Services.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

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
      <Persons
        persons={persons}
        setPersons={setPersons}
        filter={filter}
        setMessage={setMessage}
      />
    </div>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className={message.cls}>{message.msg}</div>;
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
              window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
              )
                ? Services.update(
                    persons.find((person) => person.name === newName).id,
                    { name: newName, number: newNumber }
                  ).then((returnedPerson) => {
                    setPersons(
                      persons.map((person) =>
                        person.id !== returnedPerson.id
                          ? person
                          : returnedPerson
                      )
                    );
                    setNewName("");
                    setNewNumber("");
                  })
                : console.log("Cancelled");
              return;
            }
            Services.create({ name: newName, number: newNumber }).then(
              (returnedPerson) => {
                setPersons(persons.concat(returnedPerson));
                setNewName("");
                setNewNumber("");
                setMessage({ msg: `Added ${newName}`, cls: "success" });
                setTimeout(() => {
                  setMessage({ msg: null, cls: null });
                }, 5000);
              }
            );
          }}
        >
          add
        </button>
      </div>
    </form>
  );
};

const DeleteButton = ({ person, persons, setPersons, setMessage }) => {
  return (
    <button
      onClick={() => {
        if (window.confirm(`Delete ${person.name}?`)) {
          Services.deletePerson(person.id)
            .then(() => {
              setPersons(persons.filter((p) => p.id !== person.id));
              setMessage({ msg: `Deleted ${person.name}`, cls: "success" });
              setTimeout(() => {
                setMessage({ msg: null, cls: null });
              }, 5000);
            })
            .catch((error) => {
              setPersons(persons.filter((p) => p.id !== person.id));
              setMessage({
                msg: `Information of ${person.name} has already been removed from server`,
                cls: "error",
              });
              setTimeout(() => {
                setMessage({ msg: null, cls: null });
              }, 5000);
            });
        }
      }}
    >
      delete
    </button>
  );
};

const Persons = ({ persons, setPersons, filter, setMessage }) => {
  return (
    <>
      {filter === "" // if filter is empty, show all persons
        ? persons.map((person) => (
            <div key={person.name}>
              {person.name} {person.number}{" "}
              <DeleteButton
                person={person}
                persons={persons}
                setPersons={setPersons}
                setMessage={setMessage}
              />
            </div>
          ))
        : // if filter is not empty, show only persons whose name contains the filter string
          persons
            .filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((person) => (
              <div key={person.name}>
                {person.name} {person.number}{" "}
                <DeleteButton
                  person={person}
                  persons={persons}
                  setPersons={setPersons}
                  setMessage={setMessage}
                />
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
