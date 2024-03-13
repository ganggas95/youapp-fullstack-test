import { MutableRefObject, useEffect, useRef, useState } from 'react';

const usePasswordToggler = (
    type: string = 'text',
    ref: MutableRefObject<HTMLInputElement | null | undefined> | Function
) => {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [isShown, setIsShown] = useState(false);

    const togglePassword = () => setIsShown((prev) => !prev);

    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") ref(innerRef.current);
        else ref.current = innerRef.current;
    }, [ref]);

    useEffect(() => {
        if (!innerRef.current) return;
        if (type !== 'password') return;
        innerRef.current.type = isShown ? 'text' : "password";
    }, [isShown, type]);

    return {
        ref: innerRef,
        shown: isShown,
        togglePassword,
    };
};

export default usePasswordToggler;