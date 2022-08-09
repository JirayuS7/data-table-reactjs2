import { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "id",
    selector: (row) => row.id,
    width: "110px",
  },
  {
    name: "coverimage",
    selector: (row) => row.coverimage,
    cell: (row) => <img width={120} src={row.coverimage} alt={row.name}></img>,
    width: "180px",
  },
  {
    name: "name",
    selector: (row) => row.name,
    width: "200px",
  },
  {
    name: "detail",
    selector: (row) => row.detail,
  },

  {
    name: "latitude",
    selector: (row) => row.latitude,
    width: "180px",
  },
  {
    name: "longitude",
    selector: (row) => row.longitude,
    width: "180px",
  },
];

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const fetchData = async (page) => {
    fetch(
      `https://www.mecallapi.com/api/attractions?page=${page}&per_page=${perPage}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
          setTotalRows(result.total);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerpage, page) => {
    setPerPage(newPerpage);
    fetchData(page, newPerpage);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <DataTable
        columns={columns}
        data={items}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    );
  }
}

export default App;
