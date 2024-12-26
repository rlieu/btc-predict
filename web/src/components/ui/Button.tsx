import React from 'react';

interface IButton {
    text: string;
    onClick?: () => void;
}

export const Button = ({ text, onClick }: IButton) => {
    return (
        <button
            type="button"
            style={{
                margin: '10px',
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
