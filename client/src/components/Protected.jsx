import axios from "axios";
import React, { useEffect, useState } from "react";

const Protected = () => {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState("");
  const { title, description } = input;
  const handleChange = (e) => {
    const name = e.target.name;
    setInput((prev) => {
      return {
        ...prev,
        [name]: e.target.value,
      };
    });
  };

  const getAll = () => {
    try {
      fetch("http://localhost:4000/todo-get", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) return response.json();
        })
        .then((resObject) => {
          console.log(resObject);
          // setTodo(resObject.data);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("hello");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAll();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdating) {
      axios
        .post("http:localhost:4000/todo-update", {
          _id: isUpdating,
          title,
          description,
        })
        .then((res) => {
          console.log(res);
          isUpdating("");
          getAll();
        })
        .then((error) => {
          console.log(error);
        });
    } else {
      axios
        .post("http://localhost:4000/todo-create", {
          title,
          description,
        })
        .then((res) => {
          console.log(res);
          setInput("");
          getAll();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const Update = (_id, title, description) => {
    setIsUpdating(_id);
    setInput(title, description);
  };
  const Delete = (_id) => {
    axios
      .post("http://localhost:4000/todo-delete", {
        _id,
      })
      .then((res) => {
        console.log(res);
        getAll();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // useEffect(() => {
  //   const token = JSON.parse(localStorage.getItem("auth_token"));
  //   axios
  //     .get("http://localhost:4000/protected", {
  //       headers: {
  //         Authorization: token,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <div>
      <div>
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            name="title"
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
          />
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        {todo.map((item, _id) => {
          return (
            <div key={_id}>
              <div>{item.title}</div>
              <div>{item.description}</div>
              <div>
                <button
                  onClick={Update(item._id, item.title, item.description)}
                >
                  Update
                </button>
              </div>
              <div>
                <button onClick={Delete(item._id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Protected;
