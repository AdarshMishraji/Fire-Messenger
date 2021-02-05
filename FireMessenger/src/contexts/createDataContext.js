import React, { useReducer, createContext } from 'react';

export default (reducer, actions, defaultValues) => {
    const Context = createContext();
    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, defaultValues);
        const bindActions = {};
        for (let key in actions) {
            bindActions[key] = actions[key](dispatch);
        }
        return <Context.Provider value={{ state, ...bindActions }}>
            {children}
        </Context.Provider>
    }
    return { Context, Provider };
}
