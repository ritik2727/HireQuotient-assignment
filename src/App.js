import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table/Table";
import { useEffect, useState } from "react";

function App() {
  const [members, setMembers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from the API
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => setMembers(data));
  }, []);

  return (
    <div className="App">
      <div>
        <input
          type="text"
          id="search"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Table
          members={members}
          // onDelete={handleDelete}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default App;
