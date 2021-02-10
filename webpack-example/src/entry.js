import React, { useEffect, useMemo, useRef, useState } from 'light-react';

function Child() {
    useEffect(() => {
        return () => {
            console.log("Child is unmounted...")
        }
    }, []);

    return (
        <p>child</p>
    )
}

function Comp() {
    const [displayChild, setDisplayChild] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setDisplayChild(false);
        }, 1000);
    }, []);

    return (
        <p>
            <div>
                {displayChild ? "Unmount child in 1000ms" : "Child is unmounted and should display something in the log. "}
            </div>
            {displayChild ? <Child /> : undefined}
        </p>
    )
}

React.render(
    <Comp />,
    document.getElementById("root"),
);