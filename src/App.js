import React, { useEffect, useReducer, useState } from "react";

function reducer(state, action) {
	let nextState = state;

	switch (action.type) {
		case "add-item":
			nextState = {
				...state,
				todos: [...state.todos, action.todo]
			};
			break;
		case "init":
			nextState = {
				...state,
				todos: [...action.data]
			};
			break;
		case "toggle-item":
			const n = state.todos.length;
			if (action.index >= 0 && action.index <= n - 1) {
				const todo = state.todos[action.index];
				todo.completed = !todo.completed;
			}
			window.localStorage.setItem("todos", JSON.stringify(state.todos));

			nextState = {
				...state
			};
			break;
		default:
			nextState = {
				...state
			};
			break;
	}

	return nextState;
}

function App() {
	const [title, setTitle] = useState("");

	useEffect(() => {
		const data = JSON.parse(window.localStorage.getItem("todos") || "[]");
		if (data && data.length) {
			dispatch({ data, type: "init" });
		}
	}, []);

	const initialState = {
		todos: []
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		if (state.todos.length) {
			window.localStorage.setItem("todos", JSON.stringify(state.todos));
		}
	}, [state.todos]);

	const handleSubmit = e => {
		e.preventDefault();

		dispatch({
			type: "add-item",
			todo: { completed: false, title }
		});

		setTitle("");
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="todo"
					value={title}
					onChange={e => {
						setTitle(e.target.value);
					}}
				/>
			</form>
			<ul>
				{state.todos.map((todo, index) => {
					const className = todo.completed ? "completed" : "incomplete";

					return (
						<li
							className={className}
							key={"todo-" + index}
							onClick={() => {
								dispatch({
									index,
									type: "toggle-item"
								});
							}}
						>
							{todo.title}
						</li>
					);
				})}
			</ul>
		</>
	);
}

export default App;
