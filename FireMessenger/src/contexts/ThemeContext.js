import createDataContext from './createDataContext';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_theme': {
            return { ...state, theme: action.payload };
        }
        default: {
            return state;
        }
    }
}

const setTheme = (dispatch) => {
    return (theme) => {
        console.log(theme);
        dispatch({ type: 'set_theme', payload: theme });
    }
}

export const { Context, Provider } = createDataContext(
    reducer,
    {
        setTheme
    },
    {
        theme: 'dark'
    }
)