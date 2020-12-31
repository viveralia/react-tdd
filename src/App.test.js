import { shallow, configure, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import App, { Todo, TodoForm, useTodos } from "./App";

configure({ adapter: new Adapter() });

describe("Todo Component", () => {
  const completeTodo = jest.fn();
  const removeTodo = jest.fn();
  const index = 5;
  const todo = {
    isCompleted: true,
    text: "lala",
  };

  const wrapper = shallow(
    <Todo
      todo={todo}
      index={index}
      completeTodo={completeTodo}
      removeTodo={removeTodo}
    />
  );

  it("should run the completeTodo function (only) when the first button is clicked", () => {
    wrapper.find("button").at(0).simulate("click");
    expect(completeTodo.mock.calls).toEqual([[5]]);
    expect(removeTodo.mock.calls).toEqual([]);
  });

  it("should run the removeTodo function (only) when the second button is clicked", () => {
    wrapper.find("button").at(1).simulate("click");
    expect(removeTodo.mock.calls).toEqual([[5]]);
    expect(completeTodo.mock.calls).toEqual([]);
  });
});

describe("TodoForm Component", () => {
  it("should call the addTodo function on submit", () => {
    const newTodo = "mi nuevo todo!";
    const addTodo = jest.fn();
    const preventDefault = jest.fn(); // no es necesario probarlo, podemos hacer un () => {}

    const changeEvent = { target: { value: newTodo } };
    const submitEvent = { preventDefault };

    const wrapper = shallow(<TodoForm addTodo={addTodo} />);
    wrapper.find("input").simulate("change", changeEvent);
    wrapper.find("form").simulate("submit", submitEvent);

    expect(preventDefault.mock.calls).toEqual([[]]);
    expect(addTodo.mock.calls).toEqual([[newTodo]]);
  });
});

describe("useTodos custom hook", () => {
  const HookWrapper = ({ hook }) => {
    const hookValues = hook();
    return <div {...hookValues} />;
  };

  const wrapper = shallow(<HookWrapper hook={useTodos} />);
  const getHookValues = () => wrapper.find("div").props();
  const { addTodo, completeTodo, removeTodo } = getHookValues();

  it("should add a todo when the addTodo function is called", () => {
    const newTodo = "texto de prueba";
    addTodo(newTodo);
    const { todos } = getHookValues();
    expect(todos[0]).toEqual({ text: newTodo });
  });

  it("should remove a todo when the removeTodo function is called", () => {
    removeTodo(0);
    const { todos } = getHookValues();
    expect(todos).toEqual([
      { text: "Todo 2", isCompleted: false },
      { text: "Todo 3", isCompleted: false },
    ]);
  });

  it("should mark a todo as complete", () => {
    completeTodo(0);
    const { todos } = getHookValues();
    expect(todos[0]).toEqual({ text: "Todo 1", isCompleted: true });
  });
});

describe("App", () => {
  it("should and a new todo with the DOM", () => {
    const newTodo = "My new todo";
    const preventDefault = jest.fn();
    const changeEvent = { target: { value: newTodo } };
    const submitEvent = { preventDefault };

    const wrapper = mount(<App />);
    wrapper.find("input").simulate("change", changeEvent);
    wrapper.find("form").simulate("submit", submitEvent);
    const todoNodes = wrapper.find(".todo");

    expect(preventDefault.mock.calls).toEqual([[]]);
    expect(todoNodes.length).toBe(4);
    expect(todoNodes.at(0).text().includes(newTodo)).toBeTruthy();
  });
});
